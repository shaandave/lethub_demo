//  On Linux/Electron multiple quick web requests can result in the Node.js event
//  loop getting wedged. Bug: https://github.com/electron/electron/issues/10570
//  This forces the event loop to move.
function scheduleHangWorkaround() {
    setTimeout(function() {
        setImmediate(function() {
            // NOOP
        });
    }, 1000);
}

module.exports = {scheduleHangWorkaround}
