const include = (path) => document.write(`<script src="${path}"></script>`);

include('./src/js/userInterface.js');
include('./src/js/objects/proto3d.js');
include('./src/js/engine.js');