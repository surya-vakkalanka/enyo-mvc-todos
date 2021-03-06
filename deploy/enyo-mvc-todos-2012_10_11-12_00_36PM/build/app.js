
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/cdavis/Devel/experiments/enyo-mvc-todos/enyo/tools/../../lib/layout/", onyx: "/Users/cdavis/Devel/experiments/enyo-mvc-todos/enyo/tools/../../lib/onyx/", onyx: "/Users/cdavis/Devel/experiments/enyo-mvc-todos/enyo/tools/../../lib/onyx/source/", mvc: "/Users/cdavis/Devel/experiments/enyo-mvc-todos/enyo/tools/../../lib/mvc/", css: "../source/css/", ext: "../source/ext/", models: "../source/models/", controllers: "../source/controllers/", views: "../source/views/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: ""
},
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
bottomUp: !1,
create: function() {
this.inherited(arguments), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
var t = this.fetchRowNode(e);
t && (this.setupItem(e), t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(e) {
if (this.hasNode()) {
var t = this.node.querySelectorAll('[index="' + e + '"]');
return t && t[0];
}
},
rowForEvent: function(e) {
var t = e.target, n = this.hasNode().id;
while (t && t.parentNode && t.id != n) {
var r = t.getAttribute && t.getAttribute("index");
if (r !== null) return Number(r);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n = t && t.querySelectorAll("#" + e.id);
n = n && n[0], e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i);
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 == 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0), s = i % 2 == 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), n;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath, i = r.y;
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath;
e.setScrollY(e.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
calcArrangementDifference: function(e, t, n, r) {},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var i = t.left, s = t.top, i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r;
enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n == 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex, t = this.container.toIndex;
this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var r;
for (var i = 0, s = 0, o, u; u = e[i]; i++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (r = u);
if (r) {
var a = n.width - s;
r.width = a >= 0 ? a : r.width;
}
for (var i = 0, f = t.left, o, u; u = e[i]; i++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n = this.container.getPanels(), r = this.container.clamp(t), i = this.containerBounds.width;
for (var s = r, o = 0, u; u = n[s]; s++) {
o += u.width + u.marginWidth;
if (o > i) break;
}
var a = i - o, f = 0;
if (a > 0) {
var l = r;
for (var s = r - 1, c = 0, u; u = n[s]; s--) {
c += u.width + u.marginWidth;
if (a - c <= 0) {
f = a - c, r = s;
break;
}
}
}
for (var s = 0, h = this.containerPadding.left + f, p, u; u = n[s]; s++) p = u.width + u.marginWidth, s < r ? this.arrangeControl(u, {
left: -p
}) : (this.arrangeControl(u, {
left: Math.floor(h)
}), h += p);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o; o = n[r]; r++) this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
if (this.container.getPanels().length == 1) {
var n = {};
n[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], n);
return;
}
var r = Math.floor(this.container.getPanels().length / 2), i = this.getOrderedControls(Math.floor(t) - r), s = this.containerBounds[this.axisSize] - this.margin - this.margin, o = this.margin - s * r;
for (var u = 0, a, n, f; a = i[u]; u++) n = {}, n[this.axisPosition] = o, this.arrangeControl(a, n), o += s;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(e) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels();
return e[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
ondown: "downHandler",
onclick: ""
},
downHandler: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(e, t) {
return !this.disabled;
}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v"
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
var e = this.orient == "v" ? "height" : "width", t = this.hasNode();
t && (t.style[e] = this.$.client.domStyles[e] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling ? this.createComponents(this.childComponents, {
isChrome: !0
}) : enyo.nop, this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop;
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling ? this.getScroller().setShowing(this.showing) : enyo.nop, this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop, this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: i.left - (e.left + e.width - r)
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
tag: "div",
classes: "onyx-menu-item",
events: {
onSelect: ""
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
highlander: !0,
defaultKind: "onyx.RadioButton"
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.valueChanged();
},
valueChanged: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
statics: {
addFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r != undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.setClassAttribute(e.getClassAttribute()) : e.addClass(t);
}), e.removeClass(t);
}
},
removeFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r != undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.removeClass(t) : e.setClassAttribute(e.getClassAttribute());
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu",
prepend: !0
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r = undefined, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex != undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex == undefined && (c.toolbarIndex = t);
}
}
});

// foss/underscore/underscore.js

(function() {
var e = this, t = e._, n = {}, r = Array.prototype, i = Object.prototype, s = Function.prototype, o = r.push, u = r.slice, a = r.concat, f = r.unshift, l = i.toString, c = i.hasOwnProperty, h = r.forEach, p = r.map, d = r.reduce, v = r.reduceRight, m = r.filter, g = r.every, y = r.some, b = r.indexOf, w = r.lastIndexOf, E = Array.isArray, S = Object.keys, x = s.bind, T = function(e) {
if (e instanceof T) return e;
if (!(this instanceof T)) return new T(e);
this._wrapped = e;
};
typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = T), exports._ = T) : e._ = T, T.VERSION = "1.4.2";
var N = T.each = T.forEach = function(e, t, r) {
if (e == null) return;
if (h && e.forEach === h) e.forEach(t, r); else if (e.length === +e.length) {
for (var i = 0, s = e.length; i < s; i++) if (t.call(r, e[i], i, e) === n) return;
} else for (var o in e) if (T.has(e, o) && t.call(r, e[o], o, e) === n) return;
};
T.map = T.collect = function(e, t, n) {
var r = [];
return e == null ? r : p && e.map === p ? e.map(t, n) : (N(e, function(e, i, s) {
r[r.length] = t.call(n, e, i, s);
}), r);
}, T.reduce = T.foldl = T.inject = function(e, t, n, r) {
var i = arguments.length > 2;
e == null && (e = []);
if (d && e.reduce === d) return r && (t = T.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
N(e, function(e, s, o) {
i ? n = t.call(r, n, e, s, o) : (n = e, i = !0);
});
if (!i) throw new TypeError("Reduce of empty array with no initial value");
return n;
}, T.reduceRight = T.foldr = function(e, t, n, r) {
var i = arguments.length > 2;
e == null && (e = []);
if (v && e.reduceRight === v) return r && (t = T.bind(t, r)), arguments.length > 2 ? e.reduceRight(t, n) : e.reduceRight(t);
var s = e.length;
if (s !== +s) {
var o = T.keys(e);
s = o.length;
}
N(e, function(u, a, f) {
a = o ? o[--s] : --s, i ? n = t.call(r, n, e[a], a, f) : (n = e[a], i = !0);
});
if (!i) throw new TypeError("Reduce of empty array with no initial value");
return n;
}, T.find = T.detect = function(e, t, n) {
var r;
return C(e, function(e, i, s) {
if (t.call(n, e, i, s)) return r = e, !0;
}), r;
}, T.filter = T.select = function(e, t, n) {
var r = [];
return e == null ? r : m && e.filter === m ? e.filter(t, n) : (N(e, function(e, i, s) {
t.call(n, e, i, s) && (r[r.length] = e);
}), r);
}, T.reject = function(e, t, n) {
return T.filter(e, function(e, r, i) {
return !t.call(n, e, r, i);
}, n);
}, T.every = T.all = function(e, t, r) {
t || (t = T.identity);
var i = !0;
return e == null ? i : g && e.every === g ? e.every(t, r) : (N(e, function(e, s, o) {
if (!(i = i && t.call(r, e, s, o))) return n;
}), !!i);
};
var C = T.some = T.any = function(e, t, r) {
t || (t = T.identity);
var i = !1;
return e == null ? i : y && e.some === y ? e.some(t, r) : (N(e, function(e, s, o) {
if (i || (i = t.call(r, e, s, o))) return n;
}), !!i);
};
T.contains = T.include = function(e, t) {
var n = !1;
return e == null ? n : b && e.indexOf === b ? e.indexOf(t) != -1 : (n = C(e, function(e) {
return e === t;
}), n);
}, T.invoke = function(e, t) {
var n = u.call(arguments, 2);
return T.map(e, function(e) {
return (T.isFunction(t) ? t : e[t]).apply(e, n);
});
}, T.pluck = function(e, t) {
return T.map(e, function(e) {
return e[t];
});
}, T.where = function(e, t) {
return T.isEmpty(t) ? [] : T.filter(e, function(e) {
for (var n in t) if (t[n] !== e[n]) return !1;
return !0;
});
}, T.max = function(e, t, n) {
if (!t && T.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
if (!t && T.isEmpty(e)) return -Infinity;
var r = {
computed: -Infinity
};
return N(e, function(e, i, s) {
var o = t ? t.call(n, e, i, s) : e;
o >= r.computed && (r = {
value: e,
computed: o
});
}), r.value;
}, T.min = function(e, t, n) {
if (!t && T.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
if (!t && T.isEmpty(e)) return Infinity;
var r = {
computed: Infinity
};
return N(e, function(e, i, s) {
var o = t ? t.call(n, e, i, s) : e;
o < r.computed && (r = {
value: e,
computed: o
});
}), r.value;
}, T.shuffle = function(e) {
var t, n = 0, r = [];
return N(e, function(e) {
t = T.random(n++), r[n - 1] = r[t], r[t] = e;
}), r;
};
var k = function(e) {
return T.isFunction(e) ? e : function(t) {
return t[e];
};
};
T.sortBy = function(e, t, n) {
var r = k(t);
return T.pluck(T.map(e, function(e, t, i) {
return {
value: e,
index: t,
criteria: r.call(n, e, t, i)
};
}).sort(function(e, t) {
var n = e.criteria, r = t.criteria;
if (n !== r) {
if (n > r || n === void 0) return 1;
if (n < r || r === void 0) return -1;
}
return e.index < t.index ? -1 : 1;
}), "value");
};
var L = function(e, t, n, r) {
var i = {}, s = k(t);
return N(e, function(t, o) {
var u = s.call(n, t, o, e);
r(i, u, t);
}), i;
};
T.groupBy = function(e, t, n) {
return L(e, t, n, function(e, t, n) {
(T.has(e, t) ? e[t] : e[t] = []).push(n);
});
}, T.countBy = function(e, t, n) {
return L(e, t, n, function(e, t, n) {
T.has(e, t) || (e[t] = 0), e[t]++;
});
}, T.sortedIndex = function(e, t, n, r) {
n = n == null ? T.identity : k(n);
var i = n.call(r, t), s = 0, o = e.length;
while (s < o) {
var u = s + o >>> 1;
n.call(r, e[u]) < i ? s = u + 1 : o = u;
}
return s;
}, T.toArray = function(e) {
return e ? e.length === +e.length ? u.call(e) : T.values(e) : [];
}, T.size = function(e) {
return e == null ? 0 : e.length === +e.length ? e.length : T.keys(e).length;
}, T.first = T.head = T.take = function(e, t, n) {
return e == null ? void 0 : t != null && !n ? u.call(e, 0, t) : e[0];
}, T.initial = function(e, t, n) {
return u.call(e, 0, e.length - (t == null || n ? 1 : t));
}, T.last = function(e, t, n) {
return e == null ? void 0 : t != null && !n ? u.call(e, Math.max(e.length - t, 0)) : e[e.length - 1];
}, T.rest = T.tail = T.drop = function(e, t, n) {
return u.call(e, t == null || n ? 1 : t);
}, T.compact = function(e) {
return T.filter(e, function(e) {
return !!e;
});
};
var A = function(e, t, n) {
return N(e, function(e) {
T.isArray(e) ? t ? o.apply(n, e) : A(e, t, n) : n.push(e);
}), n;
};
T.flatten = function(e, t) {
return A(e, t, []);
}, T.without = function(e) {
return T.difference(e, u.call(arguments, 1));
}, T.uniq = T.unique = function(e, t, n, r) {
var i = n ? T.map(e, n, r) : e, s = [], o = [];
return N(i, function(n, r) {
if (t ? !r || o[o.length - 1] !== n : !T.contains(o, n)) o.push(n), s.push(e[r]);
}), s;
}, T.union = function() {
return T.uniq(a.apply(r, arguments));
}, T.intersection = function(e) {
var t = u.call(arguments, 1);
return T.filter(T.uniq(e), function(e) {
return T.every(t, function(t) {
return T.indexOf(t, e) >= 0;
});
});
}, T.difference = function(e) {
var t = a.apply(r, u.call(arguments, 1));
return T.filter(e, function(e) {
return !T.contains(t, e);
});
}, T.zip = function() {
var e = u.call(arguments), t = T.max(T.pluck(e, "length")), n = new Array(t);
for (var r = 0; r < t; r++) n[r] = T.pluck(e, "" + r);
return n;
}, T.object = function(e, t) {
if (e == null) return {};
var n = {};
for (var r = 0, i = e.length; r < i; r++) t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
return n;
}, T.indexOf = function(e, t, n) {
if (e == null) return -1;
var r = 0, i = e.length;
if (n) {
if (typeof n != "number") return r = T.sortedIndex(e, t), e[r] === t ? r : -1;
r = n < 0 ? Math.max(0, i + n) : n;
}
if (b && e.indexOf === b) return e.indexOf(t, n);
for (; r < i; r++) if (e[r] === t) return r;
return -1;
}, T.lastIndexOf = function(e, t, n) {
if (e == null) return -1;
var r = n != null;
if (w && e.lastIndexOf === w) return r ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
var i = r ? n : e.length;
while (i--) if (e[i] === t) return i;
return -1;
}, T.range = function(e, t, n) {
arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
var r = Math.max(Math.ceil((t - e) / n), 0), i = 0, s = new Array(r);
while (i < r) s[i++] = e, e += n;
return s;
};
var O = function() {};
T.bind = function(t, n) {
var r, i;
if (t.bind === x && x) return x.apply(t, u.call(arguments, 1));
if (!T.isFunction(t)) throw new TypeError;
return i = u.call(arguments, 2), r = function() {
if (this instanceof r) {
O.prototype = t.prototype;
var e = new O, s = t.apply(e, i.concat(u.call(arguments)));
return Object(s) === s ? s : e;
}
return t.apply(n, i.concat(u.call(arguments)));
};
}, T.bindAll = function(e) {
var t = u.call(arguments, 1);
return t.length == 0 && (t = T.functions(e)), N(t, function(t) {
e[t] = T.bind(e[t], e);
}), e;
}, T.memoize = function(e, t) {
var n = {};
return t || (t = T.identity), function() {
var r = t.apply(this, arguments);
return T.has(n, r) ? n[r] : n[r] = e.apply(this, arguments);
};
}, T.delay = function(e, t) {
var n = u.call(arguments, 2);
return setTimeout(function() {
return e.apply(null, n);
}, t);
}, T.defer = function(e) {
return T.delay.apply(T, [ e, 1 ].concat(u.call(arguments, 1)));
}, T.throttle = function(e, t) {
var n, r, i, s, o = 0, u = function() {
o = new Date, i = null, s = e.apply(n, r);
};
return function() {
var a = new Date, f = t - (a - o);
return n = this, r = arguments, f <= 0 ? (clearTimeout(i), o = a, s = e.apply(n, r)) : i || (i = setTimeout(u, f)), s;
};
}, T.debounce = function(e, t, n) {
var r, i;
return function() {
var s = this, o = arguments, u = function() {
r = null, n || (i = e.apply(s, o));
}, a = n && !r;
return clearTimeout(r), r = setTimeout(u, t), a && (i = e.apply(s, o)), i;
};
}, T.once = function(e) {
var t = !1, n;
return function() {
return t ? n : (t = !0, n = e.apply(this, arguments), e = null, n);
};
}, T.wrap = function(e, t) {
return function() {
var n = [ e ];
return o.apply(n, arguments), t.apply(this, n);
};
}, T.compose = function() {
var e = arguments;
return function() {
var t = arguments;
for (var n = e.length - 1; n >= 0; n--) t = [ e[n].apply(this, t) ];
return t[0];
};
}, T.after = function(e, t) {
return e <= 0 ? t() : function() {
if (--e < 1) return t.apply(this, arguments);
};
}, T.keys = S || function(e) {
if (e !== Object(e)) throw new TypeError("Invalid object");
var t = [];
for (var n in e) T.has(e, n) && (t[t.length] = n);
return t;
}, T.values = function(e) {
var t = [];
for (var n in e) T.has(e, n) && t.push(e[n]);
return t;
}, T.pairs = function(e) {
var t = [];
for (var n in e) T.has(e, n) && t.push([ n, e[n] ]);
return t;
}, T.invert = function(e) {
var t = {};
for (var n in e) T.has(e, n) && (t[e[n]] = n);
return t;
}, T.functions = T.methods = function(e) {
var t = [];
for (var n in e) T.isFunction(e[n]) && t.push(n);
return t.sort();
}, T.extend = function(e) {
return N(u.call(arguments, 1), function(t) {
for (var n in t) e[n] = t[n];
}), e;
}, T.pick = function(e) {
var t = {}, n = a.apply(r, u.call(arguments, 1));
return N(n, function(n) {
n in e && (t[n] = e[n]);
}), t;
}, T.omit = function(e) {
var t = {}, n = a.apply(r, u.call(arguments, 1));
for (var i in e) T.contains(n, i) || (t[i] = e[i]);
return t;
}, T.defaults = function(e) {
return N(u.call(arguments, 1), function(t) {
for (var n in t) e[n] == null && (e[n] = t[n]);
}), e;
}, T.clone = function(e) {
return T.isObject(e) ? T.isArray(e) ? e.slice() : T.extend({}, e) : e;
}, T.tap = function(e, t) {
return t(e), e;
};
var M = function(e, t, n, r) {
if (e === t) return e !== 0 || 1 / e == 1 / t;
if (e == null || t == null) return e === t;
e instanceof T && (e = e._wrapped), t instanceof T && (t = t._wrapped);
var i = l.call(e);
if (i != l.call(t)) return !1;
switch (i) {
case "[object String]":
return e == String(t);
case "[object Number]":
return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
case "[object Date]":
case "[object Boolean]":
return +e == +t;
case "[object RegExp]":
return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase;
}
if (typeof e != "object" || typeof t != "object") return !1;
var s = n.length;
while (s--) if (n[s] == e) return r[s] == t;
n.push(e), r.push(t);
var o = 0, u = !0;
if (i == "[object Array]") {
o = e.length, u = o == t.length;
if (u) while (o--) if (!(u = M(e[o], t[o], n, r))) break;
} else {
var a = e.constructor, f = t.constructor;
if (a !== f && !(T.isFunction(a) && a instanceof a && T.isFunction(f) && f instanceof f)) return !1;
for (var c in e) if (T.has(e, c)) {
o++;
if (!(u = T.has(t, c) && M(e[c], t[c], n, r))) break;
}
if (u) {
for (c in t) if (T.has(t, c) && !(o--)) break;
u = !o;
}
}
return n.pop(), r.pop(), u;
};
T.isEqual = function(e, t) {
return M(e, t, [], []);
}, T.isEmpty = function(e) {
if (e == null) return !0;
if (T.isArray(e) || T.isString(e)) return e.length === 0;
for (var t in e) if (T.has(e, t)) return !1;
return !0;
}, T.isElement = function(e) {
return !!e && e.nodeType === 1;
}, T.isArray = E || function(e) {
return l.call(e) == "[object Array]";
}, T.isObject = function(e) {
return e === Object(e);
}, N([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(e) {
T["is" + e] = function(t) {
return l.call(t) == "[object " + e + "]";
};
}), T.isArguments(arguments) || (T.isArguments = function(e) {
return !!e && !!T.has(e, "callee");
}), typeof /./ != "function" && (T.isFunction = function(e) {
return typeof e == "function";
}), T.isFinite = function(e) {
return T.isNumber(e) && isFinite(e);
}, T.isNaN = function(e) {
return T.isNumber(e) && e != +e;
}, T.isBoolean = function(e) {
return e === !0 || e === !1 || l.call(e) == "[object Boolean]";
}, T.isNull = function(e) {
return e === null;
}, T.isUndefined = function(e) {
return e === void 0;
}, T.has = function(e, t) {
return c.call(e, t);
}, T.noConflict = function() {
return e._ = t, this;
}, T.identity = function(e) {
return e;
}, T.times = function(e, t, n) {
for (var r = 0; r < e; r++) t.call(n, r);
}, T.random = function(e, t) {
return t == null && (t = e, e = 0), e + (0 | Math.random() * (t - e + 1));
};
var _ = {
escape: {
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#x27;",
"/": "&#x2F;"
}
};
_.unescape = T.invert(_.escape);
var D = {
escape: new RegExp("[" + T.keys(_.escape).join("") + "]", "g"),
unescape: new RegExp("(" + T.keys(_.unescape).join("|") + ")", "g")
};
T.each([ "escape", "unescape" ], function(e) {
T[e] = function(t) {
return t == null ? "" : ("" + t).replace(D[e], function(t) {
return _[e][t];
});
};
}), T.result = function(e, t) {
if (e == null) return null;
var n = e[t];
return T.isFunction(n) ? n.call(e) : n;
}, T.mixin = function(e) {
N(T.functions(e), function(t) {
var n = T[t] = e[t];
T.prototype[t] = function() {
var e = [ this._wrapped ];
return o.apply(e, arguments), F.call(this, n.apply(T, e));
};
});
};
var P = 0;
T.uniqueId = function(e) {
var t = P++;
return e ? e + t : t;
}, T.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var H = /(.)^/, B = {
"'": "'",
"\\": "\\",
"\r": "r",
"\n": "n",
"	": "t",
"\u2028": "u2028",
"\u2029": "u2029"
}, j = /\\|'|\r|\n|\t|\u2028|\u2029/g;
T.template = function(e, t, n) {
n = T.defaults({}, n, T.templateSettings);
var r = new RegExp([ (n.escape || H).source, (n.interpolate || H).source, (n.evaluate || H).source ].join("|") + "|$", "g"), i = 0, s = "__p+='";
e.replace(r, function(t, n, r, o, u) {
s += e.slice(i, u).replace(j, function(e) {
return "\\" + B[e];
}), s += n ? "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : o ? "';\n" + o + "\n__p+='" : "", i = u + t.length;
}), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
try {
var o = new Function(n.variable || "obj", "_", s);
} catch (u) {
throw u.source = s, u;
}
if (t) return o(t, T);
var a = function(e) {
return o.call(this, e, T);
};
return a.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", a;
}, T.chain = function(e) {
return T(e).chain();
};
var F = function(e) {
return this._chain ? T(e).chain() : e;
};
T.mixin(T), N([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(e) {
var t = r[e];
T.prototype[e] = function() {
var n = this._wrapped;
return t.apply(n, arguments), (e == "shift" || e == "splice") && n.length === 0 && delete n[0], F.call(this, n);
};
}), N([ "concat", "join", "slice" ], function(e) {
var t = r[e];
T.prototype[e] = function() {
return F.call(this, t.apply(this._wrapped, arguments));
};
}), T.extend(T.prototype, {
chain: function() {
return this._chain = !0, this;
},
value: function() {
return this._wrapped;
}
});
}).call(this);

// foss/backbone/backbone.js

(function() {
var e = this, t = e.Backbone, n = Array.prototype, r = n.push, i = n.slice, s = n.splice, o;
typeof exports != "undefined" ? o = exports : o = e.Backbone = {}, o.VERSION = "0.9.2";
var u = e._;
!u && typeof require != "undefined" && (u = require("underscore")), o.$ = e.jQuery || e.Zepto || e.ender, o.noConflict = function() {
return e.Backbone = t, this;
}, o.emulateHTTP = !1, o.emulateJSON = !1;
var a = /\s+/, f = o.Events = {
on: function(e, t, n) {
var r, i, s;
if (!t) return this;
e = e.split(a), r = this._callbacks || (this._callbacks = {});
while (i = e.shift()) s = r[i] || (r[i] = []), s.push(t, n);
return this;
},
off: function(e, t, n) {
var r, i, s, o;
if (!(i = this._callbacks)) return this;
if (!(e || t || n)) return delete this._callbacks, this;
e = e ? e.split(a) : u.keys(i);
while (r = e.shift()) {
if (!(s = i[r]) || !t && !n) {
delete i[r];
continue;
}
for (o = s.length - 2; o >= 0; o -= 2) t && s[o] !== t || n && s[o + 1] !== n || s.splice(o, 2);
}
return this;
},
trigger: function(e) {
var t, n, r, i, s, o, u, f;
if (!(n = this._callbacks)) return this;
f = [], e = e.split(a);
for (i = 1, s = arguments.length; i < s; i++) f[i - 1] = arguments[i];
while (t = e.shift()) {
if (u = n.all) u = u.slice();
if (r = n[t]) r = r.slice();
if (r) for (i = 0, s = r.length; i < s; i += 2) r[i].apply(r[i + 1] || this, f);
if (u) {
o = [ t ].concat(f);
for (i = 0, s = u.length; i < s; i += 2) u[i].apply(u[i + 1] || this, o);
}
}
return this;
}
};
f.bind = f.on, f.unbind = f.off;
var l = o.Model = function(e, t) {
var n, r = e || {};
t && t.collection && (this.collection = t.collection), t && t.parse && (e = this.parse(e));
if (n = u.result(this, "defaults")) r = u.extend({}, n, r);
this.attributes = {}, this._escapedAttributes = {}, this.cid = u.uniqueId("c"), this.changed = {}, this._changes = {}, this._pending = {}, this.set(r, {
silent: !0
}), this.changed = {}, this._changes = {}, this._pending = {}, this._previousAttributes = u.clone(this.attributes), this.initialize.apply(this, arguments);
};
u.extend(l.prototype, f, {
changed: null,
_changes: null,
_pending: null,
_changing: null,
idAttribute: "id",
initialize: function() {},
toJSON: function(e) {
return u.clone(this.attributes);
},
sync: function() {
return o.sync.apply(this, arguments);
},
get: function(e) {
return this.attributes[e];
},
escape: function(e) {
var t;
if (t = this._escapedAttributes[e]) return t;
var n = this.get(e);
return this._escapedAttributes[e] = u.escape(n == null ? "" : "" + n);
},
has: function(e) {
return this.get(e) != null;
},
set: function(e, t) {
var n, r, i;
if (e == null) return this;
u.isObject(e) || (r = e, (e = {})[r] = t, t = arguments[2]);
var s = t && t.silent, o = t && t.unset;
e instanceof l && (e = e.attributes);
if (o) for (n in e) e[n] = void 0;
if (!this._validate(e, t)) return !1;
this.idAttribute in e && (this.id = e[this.idAttribute]);
var a = this._changing, f = this.attributes, c = this._escapedAttributes, h = this._previousAttributes || {};
for (n in e) {
i = e[n];
if (!u.isEqual(f[n], i) || o && u.has(f, n)) delete c[n], this._changes[n] = !0;
o ? delete f[n] : f[n] = i, !u.isEqual(h[n], i) || u.has(f, n) !== u.has(h, n) ? (this.changed[n] = i, s || (this._pending[n] = !0)) : (delete this.changed[n], delete this._pending[n], a || delete this._changes[n]), a && u.isEqual(f[n], a[n]) && delete this._changes[n];
}
return s || this.change(t), this;
},
unset: function(e, t) {
return t = u.extend({}, t, {
unset: !0
}), this.set(e, null, t);
},
clear: function(e) {
return e = u.extend({}, e, {
unset: !0
}), this.set(u.clone(this.attributes), e);
},
fetch: function(e) {
e = e ? u.clone(e) : {};
var t = this, n = e.success;
return e.success = function(r, i, s) {
if (!t.set(t.parse(r, s), e)) return !1;
n && n(t, r, e);
}, this.sync("read", this, e);
},
save: function(e, t) {
var n, r, i;
e != null && !u.isObject(e) && (n = e, (e = {})[n] = t, t = arguments[2]), t = t ? u.clone(t) : {};
if (t.wait) {
if (!this._validate(e, t)) return !1;
r = u.clone(this.attributes);
}
var s = u.extend({}, t, {
silent: !0
});
if (e && !this.set(e, t.wait ? s : t)) return !1;
if (!e && !this._validate(null, t)) return !1;
var o = this, a = t.success;
t.success = function(n, r, s) {
i = !0;
var f = o.parse(n, s);
t.wait && (f = u.extend(e || {}, f));
if (!o.set(f, t)) return !1;
a && a(o, n, t);
};
var f = this.sync(this.isNew() ? "create" : "update", this, t);
return !i && t.wait && (this.clear(s), this.set(r, s)), f;
},
destroy: function(e) {
e = e ? u.clone(e) : {};
var t = this, n = e.success, r = function() {
t.trigger("destroy", t, t.collection, e);
};
e.success = function(i) {
(e.wait || t.isNew()) && r(), n && n(t, i, e);
};
if (this.isNew()) return e.success(), !1;
var i = this.sync("delete", this, e);
return e.wait || r(), i;
},
url: function() {
var e = u.result(this, "urlRoot") || u.result(this.collection, "url") || A();
return this.isNew() ? e : e + (e.charAt(e.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id);
},
parse: function(e, t) {
return e;
},
clone: function() {
return new this.constructor(this.attributes);
},
isNew: function() {
return this.id == null;
},
change: function(e) {
var t = this._changing, n = this._changing = {};
for (var r in this._changes) this._pending[r] = !0;
var i = this._changes;
this._changes = {};
var s = [];
for (var r in i) n[r] = this.get(r), s.push(r);
for (var o = 0, a = s.length; o < a; o++) this.trigger("change:" + s[o], this, n[s[o]], e);
if (t) return this;
while (!u.isEmpty(this._pending)) {
this._pending = {}, this.trigger("change", this, e);
for (var r in this.changed) {
if (this._pending[r] || this._changes[r]) continue;
delete this.changed[r];
}
this._previousAttributes = u.clone(this.attributes);
}
return this._changing = null, this;
},
hasChanged: function(e) {
return e == null ? !u.isEmpty(this.changed) : u.has(this.changed, e);
},
changedAttributes: function(e) {
if (!e) return this.hasChanged() ? u.clone(this.changed) : !1;
var t, n = !1, r = this._previousAttributes;
for (var i in e) {
if (u.isEqual(r[i], t = e[i])) continue;
(n || (n = {}))[i] = t;
}
return n;
},
previous: function(e) {
return e == null || !this._previousAttributes ? null : this._previousAttributes[e];
},
previousAttributes: function() {
return u.clone(this._previousAttributes);
},
isValid: function(e) {
return !this.validate || !this.validate(this.attributes, e);
},
_validate: function(e, t) {
if (t && t.silent || !this.validate) return !0;
e = u.extend({}, this.attributes, e);
var n = this.validate(e, t);
return n ? (t && t.error && t.error(this, n, t), this.trigger("error", this, n, t), !1) : !0;
}
});
var c = o.Collection = function(e, t) {
t || (t = {}), t.model && (this.model = t.model), t.comparator !== void 0 && (this.comparator = t.comparator), this._reset(), this.initialize.apply(this, arguments), e && (t.parse && (e = this.parse(e)), this.reset(e, {
silent: !0,
parse: t.parse
}));
};
u.extend(c.prototype, f, {
model: l,
initialize: function() {},
toJSON: function(e) {
return this.map(function(t) {
return t.toJSON(e);
});
},
sync: function() {
return o.sync.apply(this, arguments);
},
add: function(e, t) {
var n, i, o, a, f, l = t && t.at;
e = u.isArray(e) ? e.slice() : [ e ];
for (n = 0, o = e.length; n < o; n++) {
if (e[n] = this._prepareModel(e[n], t)) continue;
throw new Error("Can't add an invalid model to a collection");
}
for (n = e.length - 1; n >= 0; n--) {
a = e[n], f = a.id != null && this._byId[a.id];
if (f || this._byCid[a.cid]) {
t && t.merge && f && f.set(a, t), e.splice(n, 1);
continue;
}
a.on("all", this._onModelEvent, this), this._byCid[a.cid] = a, a.id != null && (this._byId[a.id] = a);
}
this.length += e.length, i = [ l != null ? l : this.models.length, 0 ], r.apply(i, e), s.apply(this.models, i), this.comparator && l == null && this.sort({
silent: !0
});
if (t && t.silent) return this;
while (a = e.shift()) a.trigger("add", a, this, t);
return this;
},
remove: function(e, t) {
var n, r, i, s;
t || (t = {}), e = u.isArray(e) ? e.slice() : [ e ];
for (n = 0, r = e.length; n < r; n++) {
s = this.getByCid(e[n]) || this.get(e[n]);
if (!s) continue;
delete this._byId[s.id], delete this._byCid[s.cid], i = this.indexOf(s), this.models.splice(i, 1), this.length--, t.silent || (t.index = i, s.trigger("remove", s, this, t)), this._removeReference(s);
}
return this;
},
push: function(e, t) {
return e = this._prepareModel(e, t), this.add(e, t), e;
},
pop: function(e) {
var t = this.at(this.length - 1);
return this.remove(t, e), t;
},
unshift: function(e, t) {
return e = this._prepareModel(e, t), this.add(e, u.extend({
at: 0
}, t)), e;
},
shift: function(e) {
var t = this.at(0);
return this.remove(t, e), t;
},
slice: function(e, t) {
return this.models.slice(e, t);
},
get: function(e) {
return e == null ? void 0 : this._byId[e.id != null ? e.id : e];
},
getByCid: function(e) {
return e && this._byCid[e.cid || e];
},
at: function(e) {
return this.models[e];
},
where: function(e) {
return u.isEmpty(e) ? [] : this.filter(function(t) {
for (var n in e) if (e[n] !== t.get(n)) return !1;
return !0;
});
},
sort: function(e) {
if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
return u.isString(this.comparator) || this.comparator.length === 1 ? this.models = this.sortBy(this.comparator, this) : this.models.sort(u.bind(this.comparator, this)), (!e || !e.silent) && this.trigger("reset", this, e), this;
},
pluck: function(e) {
return u.invoke(this.models, "get", e);
},
reset: function(e, t) {
for (var n = 0, r = this.models.length; n < r; n++) this._removeReference(this.models[n]);
return this._reset(), e && this.add(e, u.extend({
silent: !0
}, t)), (!t || !t.silent) && this.trigger("reset", this, t), this;
},
fetch: function(e) {
e = e ? u.clone(e) : {}, e.parse === void 0 && (e.parse = !0);
var t = this, n = e.success;
return e.success = function(r, i, s) {
t[e.add ? "add" : "reset"](t.parse(r, s), e), n && n(t, r, e);
}, this.sync("read", this, e);
},
create: function(e, t) {
var n = this;
t = t ? u.clone(t) : {}, e = this._prepareModel(e, t);
if (!e) return !1;
t.wait || n.add(e, t);
var r = t.success;
return t.success = function(e, t, i) {
i.wait && n.add(e, i), r && r(e, t, i);
}, e.save(null, t), e;
},
parse: function(e, t) {
return e;
},
clone: function() {
return new this.constructor(this.models);
},
chain: function() {
return u(this.models).chain();
},
_reset: function(e) {
this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
},
_prepareModel: function(e, t) {
if (e instanceof l) return e.collection || (e.collection = this), e;
t || (t = {}), t.collection = this;
var n = new this.model(e, t);
return n._validate(n.attributes, t) ? n : !1;
},
_removeReference: function(e) {
this === e.collection && delete e.collection, e.off("all", this._onModelEvent, this);
},
_onModelEvent: function(e, t, n, r) {
if ((e === "add" || e === "remove") && n !== this) return;
e === "destroy" && this.remove(t, r), t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], t.id != null && (this._byId[t.id] = t)), this.trigger.apply(this, arguments);
}
});
var h = [ "forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortedIndex", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty" ];
u.each(h, function(e) {
c.prototype[e] = function() {
var t = i.call(arguments);
return t.unshift(this.models), u[e].apply(u, t);
};
});
var p = [ "groupBy", "countBy", "sortBy" ];
u.each(p, function(e) {
c.prototype[e] = function(t, n) {
var r = u.isFunction(t) ? t : function(e) {
return e.get(t);
};
return u[e](this.models, r, n);
};
});
var d = o.Router = function(e) {
e || (e = {}), e.routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
}, v = /\((.*?)\)/g, m = /:\w+/g, g = /\*\w+/g, y = /[-{}[\]+?.,\\^$|#\s]/g;
u.extend(d.prototype, f, {
initialize: function() {},
route: function(e, t, n) {
return u.isRegExp(e) || (e = this._routeToRegExp(e)), n || (n = this[t]), o.history.route(e, u.bind(function(r) {
var i = this._extractParameters(e, r);
n && n.apply(this, i), this.trigger.apply(this, [ "route:" + t ].concat(i)), o.history.trigger("route", this, t, i);
}, this)), this;
},
navigate: function(e, t) {
return o.history.navigate(e, t), this;
},
_bindRoutes: function() {
if (!this.routes) return;
var e = [];
for (var t in this.routes) e.unshift([ t, this.routes[t] ]);
for (var n = 0, r = e.length; n < r; n++) this.route(e[n][0], e[n][1], this[e[n][1]]);
},
_routeToRegExp: function(e) {
return e = e.replace(y, "\\$&").replace(v, "(?:$1)?").replace(m, "([^/]+)").replace(g, "(.*?)"), new RegExp("^" + e + "$");
},
_extractParameters: function(e, t) {
return e.exec(t).slice(1);
}
});
var b = o.History = function() {
this.handlers = [], u.bindAll(this, "checkUrl"), typeof window != "undefined" && (this.location = window.location, this.history = window.history);
}, w = /^[#\/]/, E = /^\/+|\/+$/g, S = /msie [\w.]+/, x = /\/$/;
b.started = !1, u.extend(b.prototype, f, {
interval: 50,
getHash: function(e) {
var t = (e || this).location.href.match(/#(.*)$/);
return t ? t[1] : "";
},
getFragment: function(e, t) {
if (e == null) if (this._hasPushState || !this._wantsHashChange || t) {
e = this.location.pathname;
var n = this.root.replace(x, "");
e.indexOf(n) || (e = e.substr(n.length));
} else e = this.getHash();
return decodeURIComponent(e.replace(w, ""));
},
start: function(e) {
if (b.started) throw new Error("Backbone.history has already been started");
b.started = !0, this.options = u.extend({}, {
root: "/"
}, this.options, e), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
var t = this.getFragment(), n = document.documentMode, r = S.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
this.root = ("/" + this.root + "/").replace(E, "/"), r && this._wantsHashChange && (this.iframe = o.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(t)), this._hasPushState ? o.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !r ? o.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = t;
var i = this.location, s = i.pathname.replace(/[^\/]$/, "$&/") === this.root;
if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !s) return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0;
this._wantsPushState && this._hasPushState && s && i.hash && (this.fragment = this.getHash().replace(w, ""), this.history.replaceState({}, document.title, this.root + this.fragment + i.search));
if (!this.options.silent) return this.loadUrl();
},
stop: function() {
o.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), b.started = !1;
},
route: function(e, t) {
this.handlers.unshift({
route: e,
callback: t
});
},
checkUrl: function(e) {
var t = this.getFragment();
t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe)));
if (t === this.fragment) return !1;
this.iframe && this.navigate(t), this.loadUrl() || this.loadUrl(this.getHash());
},
loadUrl: function(e) {
var t = this.fragment = this.getFragment(e), n = u.any(this.handlers, function(e) {
if (e.route.test(t)) return e.callback(t), !0;
});
return n;
},
navigate: function(e, t) {
if (!b.started) return !1;
if (!t || t === !0) t = {
trigger: t
};
e = this.getFragment(e || "");
if (this.fragment === e) return;
this.fragment = e;
var n = this.root + e;
if (this._hasPushState) this.history[t.replace ? "replaceState" : "pushState"]({}, document.title, n); else {
if (!this._wantsHashChange) return this.location.assign(n);
this._updateHash(this.location, e, t.replace), this.iframe && e !== this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, e, t.replace));
}
t.trigger && this.loadUrl(e);
},
_updateHash: function(e, t, n) {
if (n) {
var r = e.href.replace(/(javascript:|#).*$/, "");
e.replace(r + "#" + t);
} else e.hash = "#" + t;
}
}), o.history = new b;
var T = o.View = function(e) {
this.cid = u.uniqueId("view"), this._configure(e || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
}, N = /^(\S+)\s*(.*)$/, C = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
u.extend(T.prototype, f, {
tagName: "div",
$: function(e) {
return this.$el.find(e);
},
initialize: function() {},
render: function() {
return this;
},
dispose: function() {
return this.undelegateEvents(), this.model && this.model.off && this.model.off(null, null, this), this.collection && this.collection.off && this.collection.off(null, null, this), this;
},
remove: function() {
return this.dispose(), this.$el.remove(), this;
},
make: function(e, t, n) {
var r = document.createElement(e);
return t && o.$(r).attr(t), n != null && o.$(r).html(n), r;
},
setElement: function(e, t) {
return this.$el && this.undelegateEvents(), this.$el = e instanceof o.$ ? e : o.$(e), this.el = this.$el[0], t !== !1 && this.delegateEvents(), this;
},
delegateEvents: function(e) {
if (!e && !(e = u.result(this, "events"))) return;
this.undelegateEvents();
for (var t in e) {
var n = e[t];
u.isFunction(n) || (n = this[e[t]]);
if (!n) throw new Error('Method "' + e[t] + '" does not exist');
var r = t.match(N), i = r[1], s = r[2];
n = u.bind(n, this), i += ".delegateEvents" + this.cid, s === "" ? this.$el.bind(i, n) : this.$el.delegate(s, i, n);
}
},
undelegateEvents: function() {
this.$el.unbind(".delegateEvents" + this.cid);
},
_configure: function(e) {
this.options && (e = u.extend({}, this.options, e));
for (var t = 0, n = C.length; t < n; t++) {
var r = C[t];
e[r] && (this[r] = e[r]);
}
this.options = e;
},
_ensureElement: function() {
if (!this.el) {
var e = u.extend({}, u.result(this, "attributes"));
this.id && (e.id = u.result(this, "id")), this.className && (e["class"] = u.result(this, "className")), this.setElement(this.make(u.result(this, "tagName"), e), !1);
} else this.setElement(u.result(this, "el"), !1);
}
});
var k = {
create: "POST",
update: "PUT",
"delete": "DELETE",
read: "GET"
};
o.sync = function(e, t, n) {
var r = k[e];
n || (n = {});
var i = {
type: r,
dataType: "json"
};
n.url || (i.url = u.result(t, "url") || A()), !n.data && t && (e === "create" || e === "update") && (i.contentType = "application/json", i.data = JSON.stringify(t)), o.emulateJSON && (i.contentType = "application/x-www-form-urlencoded", i.data = i.data ? {
model: i.data
} : {}), o.emulateHTTP && (r === "PUT" || r === "DELETE") && (o.emulateJSON && (i.data._method = r), i.type = "POST", i.beforeSend = function(e) {
e.setRequestHeader("X-HTTP-Method-Override", r);
}), i.type !== "GET" && !o.emulateJSON && (i.processData = !1);
var s = n.success;
n.success = function(e, r, i) {
s && s(e, r, i), t.trigger("sync", t, e, n);
};
var a = n.error;
return n.error = function(e, r, i) {
a && a(t, e, n), t.trigger("error", t, e, n);
}, o.ajax(u.extend(i, n));
}, o.ajax = function() {
return o.$.ajax.apply(o.$, arguments);
};
var L = function(e, t) {
var n = this, r;
e && u.has(e, "constructor") ? r = e.constructor : r = function() {
n.apply(this, arguments);
}, u.extend(r, n, t);
var i = function() {
this.constructor = r;
};
return i.prototype = n.prototype, r.prototype = new i, e && u.extend(r.prototype, e), r.__super__ = n.prototype, r;
};
l.extend = c.extend = d.extend = T.extend = L;
var A = function() {
throw new Error('A "url" property or function must be specified');
};
}).call(this);

// foss/backbone/examples/backbone-localstorage.js

(function() {
function n() {
return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}
function r() {
return n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n();
}
var e = this._, t = this.Backbone;
t.LocalStorage = window.Store = function(e) {
this.name = e;
var t = this.localStorage().getItem(this.name);
this.records = t && t.split(",") || [];
}, e.extend(t.LocalStorage.prototype, {
save: function() {
this.localStorage().setItem(this.name, this.records.join(","));
},
create: function(e) {
return e.id || (e.id = r(), e.set(e.idAttribute, e.id)), this.localStorage().setItem(this.name + "-" + e.id, JSON.stringify(e)), this.records.push(e.id.toString()), this.save(), e.toJSON();
},
update: function(t) {
return this.localStorage().setItem(this.name + "-" + t.id, JSON.stringify(t)), e.include(this.records, t.id.toString()) || this.records.push(t.id.toString()), this.save(), t.toJSON();
},
find: function(e) {
return JSON.parse(this.localStorage().getItem(this.name + "-" + e.id));
},
findAll: function() {
return e(this.records).chain().map(function(e) {
return JSON.parse(this.localStorage().getItem(this.name + "-" + e));
}, this).compact().value();
},
destroy: function(t) {
return this.localStorage().removeItem(this.name + "-" + t.id), this.records = e.reject(this.records, function(e) {
return e == t.id.toString();
}), this.save(), t;
},
localStorage: function() {
return localStorage;
}
}), t.LocalStorage.sync = window.Store.sync = t.localSync = function(e, t, n, r) {
var i = t.localStorage || t.collection.localStorage;
typeof n == "function" && (n = {
success: n,
error: r
});
var s;
switch (e) {
case "read":
s = t.id != undefined ? i.find(t) : i.findAll();
break;
case "create":
s = i.create(t);
break;
case "update":
s = i.update(t);
break;
case "delete":
s = i.destroy(t);
}
s ? n.success(s) : n.error("Record not found");
}, t.ajaxSync = t.sync, t.getSyncMethod = function(e) {
return e.localStorage || e.collection && e.collection.localStorage ? t.localSync : t.ajaxSync;
}, t.sync = function(e, n, r, i) {
return t.getSyncMethod(n).apply(this, [ e, n, r, i ]);
};
})();

// Core.js

(function() {
enyo.start = function() {
enyo._app ? enyo._app.start() : console.warn("No application found");
}, enyo._handle = function(e) {
return e in this ? (enyo.asyncMethod(this, function(t) {
this.beforeHandler && this.beforeHandler(e), this[e].apply(this, t);
}, arguments), !0) : !1;
};
})();

// Collection.js

(function() {
var e = enyo.kind({
name: "enyo.Collection",
kind: "enyo.Extension",
extendFrom: "Backbone.Collection",
target: "_collection",
_collection: null,
published: {
model: null,
content: null,
length: 0,
collectionProperties: null
},
statics: {
OK: 0,
LOADING: 1,
ERROR: 2
},
constructor: function() {
this.inherited(arguments);
var e = this._get("model"), t, n = this._base, r = this._get("collectionProperties") || {};
enyo.isString(e) && (t = this.model = enyo._getPath(e)), t || enyo.error("enyo.Collection: cannot find model " + e), t = new t, n = n.extend(enyo.mixin({
model: t.model
}, r)), this._collection = new n, this.setupObservers();
},
fetch: function(t) {
t = t ? t : {};
var n = enyo.bind(this, this.didFetch, t.success);
t.success = n, t.error = enyo.bind(this, this.didError, t.error), this.set("status", e.LOADING), this._collection.fetch(t);
},
didFetch: function(t) {
this.stopNotifications(), this.set("content", this._collection.models), this.set("length", this._collection.length), this.set("status", e.OK), this.startNotifications(), t && enyo.isFunction(collback) && t.apply(this, enyo.toArray(arguments).slice(1));
},
didError: function(t) {
this.set("status", e.ERROR), t && enyo.isFunction(t) && t.apply(this, enyo.toArray(arguments).slice(1));
},
didAdd: function(e, t) {
this.stopNotifications(), this.set("content", t.models), this.set("length", t.length), this.startNotifications();
},
didRemove: function(e, t, n) {
var r = this.content;
this.stopNotifications(), this.content = t.models, this.set("length", t.length), this.startNotifications(), this.notifyObservers("content", r, this.content);
},
didChange: function(e, t) {
var n = this.content;
this.stopNotifications(), this.content = e.collection.models, this.set("length", e.collection.length), this.startNotifications(), this.notifyObservers("content", n, this.content);
},
setupObservers: function() {
var e = this._collection;
e.on("add", enyo.bind(this, this.didAdd)), e.on("remove", enyo.bind(this, this.didRemove)), e.on("change", enyo.bind(this, this.didChange));
},
methods: [ "toJSON", "sync", "add", "remove", "push", "pop", "unshift", "shift", "slice", "getByCid", "at", "where", "sort", "pluck", "reset", "create", "parse", "clone", "chain", "without", "filter", "last" ]
});
})();

// Store.js

enyo.kind({
name: "enyo.Store",
kind: "enyo.Object"
});

// CollectionController.js

enyo.kind({
name: "enyo.CollectionController",
kind: "enyo.ArrayController",
published: {
collection: null,
autoLoad: !1
},
create: function() {
this.inherited(arguments), this.collectionChanged(), this.get("autoLoad") && this.load();
},
collectionChanged: function() {
var e = this.get("collection"), t;
enyo.isString(e) ? t = this.collection = enyo._getPath(e) : t = this.collection = e;
if (!t) throw new Error("enyo.CollectionController: cannot find collection " + "%.".f(e));
this.clearBindings(), enyo.isFunction(t) && (t = this.collection = new t), this.setupBindings();
},
setupBindings: function() {
var e, t, n = this.collection;
this.binding({
from: ".collection.length",
to: ".length",
oneWay: !0
}), this.binding({
from: ".collection.content",
to: ".content"
});
},
load: function() {
this.collection.fetch();
},
add: function() {
return this.collection.add.apply(this.collection, arguments);
},
remove: function() {
return this.collection.remove.apply(this.collection, arguments);
}
});

// ModelController.js

enyo.kind({
name: "enyo.ModelController",
kind: "enyo.Controller",
published: {
model: null,
attributes: null
},
constructor: function(e) {
this.model = e.model, this.inherited(arguments);
},
create: function() {
this.inherited(arguments), this.modelChanged();
},
modelChanged: function() {
var e = 0, t, n, r = this.model, i = {};
if (!r || this.lastModel === r) return;
this.lastModel = r, r.on("change", this._updateResponder = enyo.bind(this, this.didUpdate)), r.on("destroy", this._destroyResponder = enyo.bind(this, this.didDestroy));
},
didUpdate: function(e) {
var t, n = e.changedAttributes();
t = n ? enyo.keys(n) : !1;
if (t && t.length) {
this.stopNotifications();
while (t.length) c = t.shift(), this.notifyObservers(c, e.previous(c), e.get(c));
this.startNotifications();
}
},
didDestroy: function() {
this.removeModel();
},
removeModel: function() {
var e = this.model;
e && (e.off("change", this._updateResponder), e.off("destroy", this._destroyResponder)), this.model = null;
},
destroy: function() {
this.removeModel(), this.inherited(arguments);
},
get: function() {
var e;
if (this.model) {
e = this.model.get.apply(this.model, arguments);
if (e) return e;
}
return this.inherited(arguments);
},
set: function(e, t) {
return this.model && e in this.model.attributes ? (this.model.set(e, t), this) : this.inherited(arguments);
}
});

// ApplicationController.js

enyo.kind({
name: "enyo.ApplicationController",
kind: "enyo.Controller",
beforeHandler: enyo.nop,
handle: function() {
return enyo._handle.apply(this, arguments);
}
});

// Model.js

enyo.kind({
name: "enyo.Model",
kind: "enyo.Extension",
extendFrom: "Backbone.Model",
target: "_model",
_model: null,
published: {
model: "",
modelProperties: null,
saveOnChange: !0
},
constructor: function() {
this.inherited(arguments);
var e = this._get("modelProperties") || {};
this.model = this._base.extend(e);
},
methods: [ "escape", "has", "unset", "clear", "defaults", "toJSON", "save", "destroy", "validate", "isValid", "url", "urlRoot", "parse", "clone", "isNew", "change", "hasChanged", "changedAttributes", "previous", "previousAttributes" ]
});

// Application.js

(function() {
enyo._app = null, enyo.app = function(e) {
var t = enyo.global[e.name], n;
n = enyo.global[e.name] = new enyo.Application(e);
if (t) for (var r in t) n[r] = t[r];
return n;
}, enyo.kind({
name: "enyo.Application",
kind: "enyo.Control",
published: {
store: !1,
router: !1,
controller: null
},
_eventQueue: null,
constructor: function(e) {
var t = e.classes || "";
this._eventQueue = [], t = e.name.toLowerCase() + "-app" + t, e.classes = t, enyo.mixin(this, e), this.inherited(arguments), enyo._app = this;
},
create: function() {
this._createArguments = arguments;
},
start: function() {
this.main && enyo.isFunction(this.main) && this.main(), this.inherited(this._createArguments), this.setup(), this.renderInto(document.body), this.router && this.router.start();
},
setup: function() {
this.setupRouter();
},
setupRouter: function() {
var e = this.router, t = this.controller;
if (!enyo.isString(e)) return;
e = enyo._getPath(e);
if (!e) return console.warn("enyo.Application: could not find the router `" + this.router + "`");
e = this.router = new e, e.set("controller", t);
},
dispatchEvent: function() {
if (!this.controller || !this.controller.handle) {
this._eventQueue.push(arguments);
return;
}
this.controller.handle.apply(this.controller, arguments) || this.inherited(arguments);
},
controllerChanged: function() {
this.inherited(arguments);
var e = this._eventQueue || [], t;
while (e.length) t = e.shift(), this.dispatchEvent.apply(this, t);
},
handle: function() {
return enyo._handle.apply(this, arguments);
}
});
})();

// CollectionRepeater.js

(function() {
var e = {
_autoBindings: null,
destroy: function() {
var e = this.get("controller");
e && e.destroy(), this.controller = null, this._clearAutoBindings(), this.__proto__.destroy.call(this);
},
_initAutoBindings: function() {
var e = this.get("controller"), t, n, r;
if (!e) return;
for (r in this.$) {
if (!this.$.hasOwnProperty(r)) continue;
t = this.$[r], n = t.bindProperty;
if (!n) continue;
this._autoBinding({
from: "." + n,
to: this.getBindTargetFor(t),
source: e,
target: t
});
}
},
syncBindings: function() {
var e = this._autoBindings, t = 0, n;
for (; t < e.length; ++t) n = e[t], n && n.sync(!0);
},
getBindTargetFor: function(e) {
var t = e.get("bindTarget");
return t || (t = ".content"), t[0] === "." ? t : "." + t;
},
_controllerChanged: enyo.Observer(function() {
this._clearAutoBindings(), this._initAutoBindings();
}, "controller"),
_autoBinding: function() {
var e = this._autoBindings || (this._autoBindings = []), t, n, r = {}, i = 0;
n = enyo.toArray(arguments);
for (; i < n.length; ++i) enyo.mixin(r, n[i]);
return t = new enyo.Binding({
owner: this,
autoConnect: !0
}, r), t.isAutoBinding = !0, e.push(t), t;
},
_clearAutoBindings: function() {
var e = this._autoBindings, t;
if (!e) return;
while (e.length > 0) t = e.shift(), t.destroy();
}
};
enyo.kind({
name: "enyo.CollectionRepeater",
published: {
controller: null,
length: null,
content: null,
bindProperty: "content"
},
create: function() {
this.inherited(arguments), this.controllerChanged(), this.contentChanged();
},
controllerChanged: function() {
var e = this.get("controller"), t, n = this.get("bindProperty"), r, i, s;
enyo.isString(e) ? t = this.controller = enyo._getPath(e) : t = e;
if (!t) return console.warn("enyo.CollectionRepeater.controllerChanged: none found or available", e), !1;
enyo.isFunction(t) && (t = this.controller = new t), this.clearBindings(), r = "controller." + (n[0] === "." ? n.slice(1) : n), this.binding({
from: r,
to: "content"
});
},
initComponents: function() {
this.rowControl = this.components || this.kindComponents, this.components = this.kindComponents = null, this.rowControl = this.rowControl[0], this.inherited(arguments);
},
render: function() {
var t = 0, n, r, i = this.get("content"), s = this.length, o, u = !1;
o = function(e, t) {
return n ? n instanceof enyo.Controller ? n.set("model", t) : new n({
model: t
}) : (e && enyo.isString(e) ? n = enyo._getPath(e) : e && e instanceof enyo.Controller ? n = e : e && enyo.isFunction(e) && (n = e), n || (n = enyo.ModelController), o(n, t));
};
for (t = 0; t < s; ++t) (r = this.children[t]) ? (r.controller.set("model", i[t]), r.controller.set("owner", r), r.syncBindings(), u = !1) : (u = !0, r = this.createComponent(this.rowControl, e), r.set("controller", o(r.controller || r.controllerClass, i[t]))), r._setup(!0), u && r.render();
if (s < this.children.length) {
r = this.children.slice(s);
while (r.length) n = r.shift(), n.destroy();
}
},
contentChanged: function() {
var e = this.get("content");
this.length !== e.length && this.set("length", e.length), this.render();
}
});
})();

// Router.js

enyo.kind({
name: "Todo.Router",
kind: "enyo.Router",
routes: [ "active", "completed" ]
});

// TodoModel.js

enyo.kind({
name: "Todo.TodoModel",
kind: "enyo.Model",
modelProperties: {
defaults: {
title: "",
completed: !1
}
}
});

// TodosCollection.js

enyo.kind({
name: "Todo.TodosCollection",
kind: "enyo.Collection",
model: "Todo.TodoModel",
collectionProperties: {
localStorage: new Store("todos-enyo")
},
completed: enyo.Computed(function() {
return enyo.filter(this.content, function(e) {
return e.get("completed");
});
}),
remaining: enyo.Computed(function() {
return enyo.filter(this.content, function(e) {
return !e.get("completed");
});
}),
didAdd: function(e) {
e.save(), this.inherited(arguments);
},
didRemove: function(e) {
e.destroy(), this.inherited(arguments);
}
});

// AppController.js

enyo.kind({
name: "Todo.AppController",
kind: "enyo.ApplicationController",
beforeHandler: function(e) {},
active: function() {
Todo.todos.set("filter", "active");
},
completed: function() {
Todo.todos.set("filter", "completed");
},
"default": function() {
Todo.todos.set("filter", "all");
}
});

// TodosController.js

enyo.kind({
name: "Todo.TodosController",
kind: "enyo.CollectionController",
collection: "Todo.TodosCollection",
autoLoad: !0,
published: {
filter: "all",
filteredContent: null,
completed: null,
completedCount: null,
remaining: null,
remainingCount: null,
toggleAllCompleted: !1
},
completed: enyo.Computed(function() {
return this.collection.get("completed");
}, "content"),
completedCount: enyo.Computed(function() {
return this.get("completed").length;
}, "completed"),
remaining: enyo.Computed(function() {
return this.collection.get("remaining");
}, "content"),
remainingCount: enyo.Computed(function() {
return this.get("remaining").length;
}, "remaining"),
filteredContent: enyo.Computed(function() {
var e = this.get("filter"), t;
return e === "all" ? t = this.get("content") : e === "completed" ? t = this.get("completed") : e === "active" ? t = this.get("remaining") : t = [], t;
}, "content", "filter"),
completedChanged: function() {
if (!this.get("content")) return;
this.get("completed").length === this.get("content").length && this.get("content").length !== 0 ? this.set("toggleAllCompleted", !0) : this.set("toggleAllCompleted", !1);
},
toggleAllCompletedChanged: function() {
var e = this.content || [], t = e.length, n = 0, r = this.get("completed");
if (this.toggleAllCompleted === !1 && e.length !== r.length) return;
this.stopNotifications();
for (; n < t; ++n) e[n].get("completed") !== this.toggleAllCompleted && e[n].save("completed", this.toggleAllCompleted);
this.startNotifications();
},
clearCompleted: function() {
this.remove(this.get("completed"));
}
});

// RowController.js

enyo.kind({
name: "Todo.RowController",
kind: "enyo.ModelController",
handlers: {
onDestroyTapped: "destroyTapped",
ondblclick: "rowTapped",
onEnterPressed: "enterPressed",
onEditorBlurred: "enterPressed"
},
published: {
isEditing: !1
},
destroyTapped: function() {
return Todo.todos.remove(this.model), !0;
},
rowTapped: function() {
return this.isEditing || this.set("isEditing", !0), !0;
},
enterPressed: function() {
this.isEditing && this.set("isEditing", !1);
},
isEditingChanged: function(e, t) {
e === !0 && t === !1 && this.owner && this.model.save({
title: this.owner.get("$.editor").getValue()
});
}
});

// CreatorController.js

enyo.kind({
name: "Todo.CreatorController",
kind: "enyo.Controller",
handlers: {
onkeyup: "keyup"
},
keyup: function(e, t) {
t.which === 13 && (Todo.todos.add({
title: this.owner.get("value")
}), this.owner.setNodeProperty("value", ""));
}
});

// ToggleAllController.js

enyo.kind({
name: "Todo.ToggleAllController",
kind: "enyo.Controller",
handlers: {
onchange: "toggle"
},
toggle: function() {
return Todo.todos.set("toggleAllCompleted", !Todo.todos.toggleAllCompleted), !0;
}
});

// ClearCompletedController.js

enyo.kind({
name: "Todo.ClearCompletedController",
kind: "enyo.Controller",
handlers: {
ontap: "tapped"
},
tapped: function() {
Todo.todos.clearCompleted();
}
});

// Count.js

enyo.kind({
name: "Todo.Count",
tag: "span",
id: "todo-count",
published: {
count: 0
},
content: enyo.Computed(function() {
var e = this.count;
return enyo.format("%. item%.left", e, e === 1 ? " " : "s ");
}, "count")
});

// Filters.js

enyo.kind({
name: "Todo.Filters",
id: "filters",
tag: "ul",
bindings: [ {
from: "Todo.todos.filter",
to: "$.all.filter",
oneWay: !0
}, {
from: "Todo.todos.filter",
to: "$.active.filter",
oneWay: !0
}, {
from: "Todo.todos.filter",
to: "$.completed.filter",
oneWay: !0
} ],
components: [ {
tag: "li",
components: [ {
kind: "Todo.FilterLink",
content: "All",
match: "all",
name: "all"
} ]
}, {
tag: "li",
components: [ {
kind: "Todo.FilterLink",
content: "Active",
target: "active",
name: "active"
} ]
}, {
tag: "li",
components: [ {
kind: "Todo.FilterLink",
content: "Completed",
target: "completed",
name: "completed"
} ]
} ]
});

// Creator.js

enyo.kind({
name: "Todo.Creator",
kind: "enyo.Input",
classes: "todo-input",
placeholder: "What needs to be done?",
controller: "Todo.CreatorController"
});

// ClearCompleted.js

enyo.kind({
name: "Todo.ClearCompleted",
kind: "enyo.Button",
id: "clear-completed",
controller: "Todo.ClearCompletedController",
bindings: [ {
from: "count",
to: "showing",
oneWay: !0
} ],
published: {
count: 0
},
content: enyo.Computed(function() {
return enyo.format("Clear completed (%.)", this.count);
}, "count")
});

// Header.js

enyo.kind({
name: "Todo.Header",
tag: "header",
id: "header",
components: [ {
tag: "h1",
content: "todos"
}, {
id: "new-todo",
kind: "Todo.Creator"
} ]
});

// List.js

enyo.kind({
name: "Todo.List",
id: "todo-list",
tag: "ul",
kind: "enyo.CollectionRepeater",
bindProperty: "filteredContent",
controller: "Todo.todos",
components: [ {
kind: "Todo.Row"
} ]
});

// ToggleAll.js

enyo.kind({
name: "Todo.ToggleAll",
kind: "enyo.Checkbox",
controller: "Todo.ToggleAllController"
});

// Footer.js

enyo.kind({
name: "Todo.Footer",
tag: "footer",
id: "footer",
bindings: [ {
from: "Todo.todos.remainingCount",
to: "$.counter.count",
oneWay: !0
}, {
from: "Todo.todos.completedCount",
to: "$.clear.count",
oneWay: !0
} ],
components: [ {
kind: "Todo.Count",
name: "counter"
}, {
kind: "Todo.Filters"
}, {
kind: "Todo.ClearCompleted",
name: "clear"
} ]
});

// Main.js

enyo.kind({
name: "Todo.Main",
id: "main",
tag: "section",
showing: !1,
published: {
toggleAllOff: !1
},
bindings: [ {
from: "Todo.todos.toggleAllCompleted",
to: "$.toggleAll.checked",
oneWay: !0
}, {
from: "Todo.todos.length",
to: "$.toggleAll.showing",
oneWay: !0
}, {
from: "Todo.todos.length",
to: "showing",
oneWay: !0
} ],
components: [ {
kind: "Todo.ToggleAll",
id: "toggle-all",
name: "toggleAll",
showing: !1
}, {
tag: "label",
attributes: {
"for": "toggle-all"
},
content: "Mark all as complete"
}, {
kind: "Todo.List"
} ]
});

// App.js

enyo.app({
name: "Todo",
store: !0,
router: "Todo.Router",
controller: "Todo.AppController",
tag: "section",
id: "todoapp",
bindings: [ {
from: "Todo.todos.length",
to: "$.footer.showing",
oneWay: !0
} ],
components: [ {
kind: "Todo.Header"
}, {
kind: "Todo.Main",
name: "main"
}, {
kind: "Todo.Footer",
name: "footer"
} ],
main: function() {
enyo.singleton({
name: "Todo.todos",
kind: "Todo.TodosController"
});
}
});

// Row.js

enyo.kind({
name: "Todo.Row",
tag: "li",
controllerClass: "Todo.RowController",
published: {
isCompleted: !1,
isEditing: !1
},
bindings: [ {
from: "controller.completed",
to: "isCompleted",
oneWay: !0
}, {
from: "controller.isEditing",
to: "isEditing",
oneWay: !0
}, {
from: "controller.isEditing",
to: "$.editor.showing",
oneWay: !0
}, {
from: "controller.title",
to: "$.editor.value",
oneWay: !0
} ],
components: [ {
classes: "view",
components: [ {
bindProperty: "completed",
bindTarget: "checked",
kind: "enyo.Checkbox",
classes: "toggle"
}, {
name: "title",
tag: "label",
bindProperty: "title"
}, {
kind: "Todo.DestroyRow",
classes: "destroy"
} ]
}, {
name: "editor",
kind: "Todo.RowEditor",
classes: "edit"
} ],
isCompletedChanged: function() {
this.addRemoveClass("completed", this.isCompleted);
},
isEditingChanged: function() {
this.addRemoveClass("editing", this.isEditing);
}
});

// DestroyRow.js

enyo.kind({
name: "Todo.DestroyRow",
kind: "enyo.Button",
handlers: {
ontap: "doDestroyTapped"
},
events: {
onDestroyTapped: ""
}
});

// RowEditor.js

enyo.kind({
name: "Todo.RowEditor",
kind: "enyo.Input",
handlers: {
onkeyup: "keyup",
onblur: "blur",
onfocus: "focused"
},
events: {
onEnterPressed: "",
onEditorBlurred: ""
},
keyup: function(e, t) {
return t.which === 13 ? this.doEnterPressed() : this.inherited(arguments);
},
showingChanged: function() {
this.showing && this.focus();
},
blur: function() {
return this.doEditorBlurred(), !0;
}
});

// FilterLink.js

enyo.kind({
name: "Todo.FilterLink",
tag: "span",
published: {
filter: null,
match: null,
target: null
},
tap: function() {
return Todo.router.route(this.get("target") || ""), !0;
},
filterChanged: function() {
var e = this.filter, t = this.match || this.target;
this.addRemoveClass("selected", e === t);
}
});
