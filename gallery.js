/* ============================================================================
   gallery.js  ·  grid rendering, tag filtering and lightbox
   ----------------------------------------------------------------------------
   Shared by index.html, series/index.html and every series page, for the same
   reason gallery.css is shared: five copies of this would drift apart.

   No dependencies, no build step, no CDN. Plain script, not a module, so the
   whole site works when opened directly from disk (ES modules would hit CORS
   restrictions on file:// and silently render nothing).

   Reads window.PHOTOS and window.SERIES from photos.js.
   ========================================================================== */
(function () {
  "use strict";

  var PHOTOS = window.PHOTOS || [];
  var SERIES = window.SERIES || [];

  /* ---------- helpers ---------------------------------------------------- */

  // "images/midnight-arc.jpg" -> { base:"images/midnight-arc", ext:"jpg" }
  function split(file) {
    var i = file.lastIndexOf(".");
    return { base: file.slice(0, i), ext: file.slice(i + 1) };
  }

  // Widths are prefixed so pages in series/ resolve back to the repo root.
  function srcset(file, prefix) {
    var p = split(file);
    return [800, 1400, 2000]
      .map(function (w) { return prefix + p.base + "-" + w + "." + p.ext + " " + w + "w"; })
      .join(", ");
  }
  function variant(file, w, prefix) {
    var p = split(file);
    return prefix + p.base + "-" + w + "." + p.ext;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // 2024-03-12 -> "March 2024". Month precision is enough for a photo caption.
  var MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
  function niceDate(iso) {
    if (!iso) return "";
    var m = /^(\d{4})-(\d{2})/.exec(iso);
    if (!m) return iso;
    return MONTHS[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  function seriesBySlug(slug) {
    for (var i = 0; i < SERIES.length; i++) if (SERIES[i].slug === slug) return SERIES[i];
    return null;
  }

  // Featured photo leads, then newest first. A portfolio should open with its
  // strongest frame rather than whatever happens to be most recent.
  function gridOrder(a, b) {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    return (b.date || "").localeCompare(a.date || "");
  }

  /* ---------- signature ----------------------------------------------------
     Nothing to do here. The signature is composited into the JPEG by
     resize.sh, so it is part of the image in every variant and survives a
     download. There was a DOM overlay here; see the note in gallery.css for
     why it went. photos.js keeps its `sig` field as a record of which tone
     each photo was exported with.
     ---------------------------------------------------------------------- */

  /* ---------- caption ---------------------------------------------------- */

  function caption(photo, opts) {
    var cap = el("figcaption");
    cap.appendChild(el("span", "t", photo.title));
    var meta = [];
    if (photo.place) meta.push(photo.place);
    if (photo.date) meta.push(niceDate(photo.date));
    if (opts && opts.series && photo.series) {
      var s = seriesBySlug(photo.series);
      if (s) meta.push(s.title);
    }
    meta.forEach(function (t) {
      cap.appendChild(el("span", "sep", "·"));
      cap.appendChild(el("span", null, t));
    });
    if (photo.settings) cap.appendChild(el("span", "s", photo.settings));
    return cap;
  }

  /* ---------- one grid tile --------------------------------------------- */

  function tile(photo, index, prefix, eager) {
    var li = el("li");
    var fig = el("figure");

    var btn = el("button", "tile");
    btn.type = "button";
    btn.setAttribute("data-index", String(index));
    btn.setAttribute("aria-label", "Open " + photo.title + " full size");

    var frame = el("span", "frame");
    var img = el("img", "photo");
    img.src = variant(photo.file, 1400, prefix);
    img.srcset = srcset(photo.file, prefix);
    // 3 columns inside a 1140px container, minus gaps, is about 360px
    img.sizes = "(max-width:560px) 92vw, (max-width:900px) 46vw, 360px";
    img.width = photo.width;
    img.height = photo.height;       // explicit dims: no layout shift
    img.alt = photo.alt || photo.title;
    // setAttribute rather than the IDL property: the property is a no-op in
    // engines that do not implement it, and then nothing is lazy at all.
    img.setAttribute("decoding", "async");
    if (!eager) img.setAttribute("loading", "lazy");

    frame.appendChild(img);
    btn.appendChild(frame);

    fig.appendChild(btn);
    fig.appendChild(caption(photo, { series: false }));
    li.appendChild(fig);
    return li;
  }

  /* ---------- lightbox --------------------------------------------------- */

  function Lightbox(list, prefix) {
    var self = this;
    this.list = list;
    this.prefix = prefix;
    this.i = 0;
    this.opener = null;

    var root = el("div", "lb");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Photo viewer");
    root.hidden = true;

    var inner = el("div", "lb-inner");

    var frame = el("div", "lb-frame");
    var img = el("img", "photo");
    img.decoding = "async";
    frame.appendChild(img);

    var prev = el("button", "lb-btn lb-prev", "‹");
    prev.type = "button"; prev.setAttribute("aria-label", "Previous photo");
    var next = el("button", "lb-btn lb-next", "›");
    next.type = "button"; next.setAttribute("aria-label", "Next photo");
    var close = el("button", "lb-btn lb-close", "✕");
    close.type = "button"; close.setAttribute("aria-label", "Close viewer");

    var cap = el("figcaption");
    var pos = el("p", "lb-pos");

    inner.appendChild(frame);
    inner.appendChild(cap);
    inner.appendChild(pos);
    inner.appendChild(prev);
    inner.appendChild(next);
    inner.appendChild(close);
    root.appendChild(inner);
    document.body.appendChild(root);

    this.root = root; this.inner = inner; this.img = img;
    this.cap = cap; this.pos = pos;
    this.focusables = [prev, next, close];

    prev.addEventListener("click", function () { self.step(-1); });
    next.addEventListener("click", function () { self.step(1); });
    close.addEventListener("click", function () { self.close(); });

    // click the backdrop, not the photo, to dismiss
    root.addEventListener("click", function (e) {
      if (e.target === root) self.close();
    });

    document.addEventListener("keydown", function (e) {
      if (!self.isOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); self.close(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); self.step(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); self.step(1); }
      else if (e.key === "Tab") self.trap(e);
    });

    // swipe
    var x0 = null, y0 = null;
    root.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) self.step(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    });
  }

  Lightbox.prototype.isOpen = function () { return this.root.classList.contains("is-open"); };

  Lightbox.prototype.setList = function (list) { this.list = list; };

  Lightbox.prototype.open = function (index, opener) {
    this.opener = opener || null;
    this.root.hidden = false;
    this.root.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    this.show(index);
    this.focusables[2].focus();   // close button, so Escape is discoverable
  };

  Lightbox.prototype.close = function () {
    this.root.classList.remove("is-open");
    this.root.hidden = true;
    document.documentElement.style.overflow = "";
    if (this.opener && this.opener.focus) this.opener.focus();
    this.opener = null;
  };

  Lightbox.prototype.step = function (d) {
    if (this.list.length < 2) return;
    this.show((this.i + d + this.list.length) % this.list.length);
  };

  Lightbox.prototype.show = function (index) {
    var p = this.list[index];
    if (!p) return;
    this.i = index;

    this.img.src = variant(p.file, 1400, this.prefix);
    this.img.srcset = srcset(p.file, this.prefix);
    this.img.sizes = "100vw";
    this.img.width = p.width;
    this.img.height = p.height;
    this.img.alt = p.alt || p.title;

    this.cap.replaceChildren.apply(this.cap, Array.prototype.slice.call(caption(p, { series: true }).childNodes));
    this.pos.textContent = (index + 1) + " / " + this.list.length;

    this.preloadNeighbours();
  };

  // exactly the two neighbours, no more
  Lightbox.prototype.preloadNeighbours = function () {
    var n = this.list.length, self = this;
    [-1, 1].forEach(function (d) {
      var p = self.list[(self.i + d + n) % n];
      if (!p) return;
      var im = new Image();
      im.src = variant(p.file, 1400, self.prefix);
    });
  };

  Lightbox.prototype.trap = function (e) {
    var f = this.focusables.filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ---------- grid + filters -------------------------------------------- */

  function buildGrid(mount, photos, prefix, lightbox) {
    var ul = el("ul", "grid");
    photos.forEach(function (p, i) {
      ul.appendChild(tile(p, i, prefix, i < 3));   // first row eager, rest lazy
    });
    mount.replaceChildren(ul);

    ul.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".tile") : null;
      if (!btn) return;
      lightbox.setList(photos);
      lightbox.open(parseInt(btn.getAttribute("data-index"), 10), btn);
    });
  }

  function allTags(photos) {
    var seen = {}, out = [];
    photos.forEach(function (p) {
      (p.tags || []).forEach(function (t) {
        if (!seen[t]) { seen[t] = 1; out.push(t); }
      });
    });
    return out.sort();
  }

  function init() {
    var mount = document.getElementById("gallery");
    if (!mount) return;

    // pages inside series/ need to climb one level for images and signatures
    var prefix = mount.getAttribute("data-prefix") || "";
    var only = mount.getAttribute("data-series");

    var pool = PHOTOS.slice().sort(gridOrder);
    if (only) pool = pool.filter(function (p) { return p.series === only; });

    var lb = new Lightbox(pool, prefix);
    var countEl = document.getElementById("count");

    function render(tag) {
      var shown = tag && tag !== "all"
        ? pool.filter(function (p) { return (p.tags || []).indexOf(tag) !== -1; })
        : pool;
      buildGrid(mount, shown, prefix, lb);
      if (countEl) {
        countEl.textContent = shown.length + (shown.length === 1 ? " photo" : " photos")
          + (tag && tag !== "all" ? " tagged " + tag : "");
      }
    }

    var chipBox = document.getElementById("filters");
    if (chipBox) {
      var tags = ["all"].concat(allTags(pool));
      var lbl = el("li", "label", "Filter");
      chipBox.appendChild(lbl);
      tags.forEach(function (t) {
        var li = el("li");
        var b = el("button", "chip", t);
        b.type = "button";
        b.setAttribute("data-tag", t);
        b.setAttribute("aria-pressed", "false");
        li.appendChild(b);
        chipBox.appendChild(li);
      });

      chipBox.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest(".chip") : null;
        if (!b) return;
        var t = b.getAttribute("data-tag");
        // linkable: #tag=sky
        location.hash = t === "all" ? "" : "tag=" + encodeURIComponent(t);
        if (t === "all" && location.hash === "") applyHash();
      });

      function applyHash() {
        var m = /tag=([^&]+)/.exec(location.hash);
        var t = m ? decodeURIComponent(m[1]) : "all";
        if (tags.indexOf(t) === -1) t = "all";
        Array.prototype.forEach.call(chipBox.querySelectorAll(".chip"), function (b) {
          b.setAttribute("aria-pressed", String(b.getAttribute("data-tag") === t));
        });
        render(t);
      }
      window.addEventListener("hashchange", applyHash);
      applyHash();
    } else {
      render("all");
    }
  }

  /* ---------- series index cards ---------------------------------------- */

  function initSeriesIndex() {
    var mount = document.getElementById("series-list");
    if (!mount) return;
    var prefix = mount.getAttribute("data-prefix") || "";

    SERIES.forEach(function (s) {
      var inSeries = PHOTOS.filter(function (p) { return p.series === s.slug; }).sort(gridOrder);
      var cover = inSeries[0];
      var li = el("li", "series-card");

      if (cover) {
        var a = el("a", "thumb");
        a.href = prefix + "series/" + s.slug + ".html";
        a.setAttribute("tabindex", "-1");     // the heading link is the real target
        a.setAttribute("aria-hidden", "true");
        var img = el("img");
        img.src = variant(cover.file, 800, prefix);
        img.alt = "";
        img.width = 800;
        img.height = 450;
        img.loading = "lazy";
        img.decoding = "async";
        a.appendChild(img);
        li.appendChild(a);
      }

      var body = el("div", "body");
      var h = el("h3");
      var link = el("a", null, s.title);
      link.href = prefix + "series/" + s.slug + ".html";
      h.appendChild(link);
      body.appendChild(h);
      body.appendChild(el("p", null, s.note));
      body.appendChild(el("p", "n", inSeries.length + (inSeries.length === 1 ? " photo" : " photos")));
      li.appendChild(body);
      mount.appendChild(li);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(); initSeriesIndex(); });
  } else {
    init(); initSeriesIndex();
  }
})();
