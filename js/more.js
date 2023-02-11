const editors = [];

let activeTheme = "dark";
let currentStep = parseInt(localStorage.getItem("tsparticles-confetti/theme"), 10) || 0;

const prefersLightTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");
const themes = {
    light: "ace/theme/xcode",
    dark: "ace/theme/monokai",
};

const getPreferedTheme = function () {
    return prefersLightTheme
        ? prefersLightTheme.matches
            ? "light"
            : "dark"
        : "dark";
};

const setTheme = function (isAuto, theme) {
    if (isAuto) {
        document.body.setAttribute("auto-theme", true);

        activeTheme = getPreferedTheme();
    } else {
        document.body.removeAttribute("auto-theme");

        activeTheme = theme;
    }

    document.body.setAttribute("data-theme", activeTheme);

    editors.forEach(function (editor) {
        editor.setTheme(themes[activeTheme]);
    });
};

const updateTheme = function (step) {
    currentStep = step;

    switch (step) {
        case 0:
            setTheme(true);

            prefersLightTheme && prefersLightTheme.addEventListener("change", setTheme);

            break;

        case 1:
        case 2:
            setTheme(false, step === 1 ? "dark" : "light");

            prefersLightTheme && prefersLightTheme.removeListener(setTheme);
            break;
    }

    localStorage.setItem("tsparticles-confetti/theme", currentStep);
};

updateTheme(currentStep);

document.getElementById("themeToggle").addEventListener("click", function (event) {
    updateTheme(++currentStep % 3);
});

const modes = [
    {
        id: "cannon",
        name: "Basic Cannon",
        description: [ {
            cssClass: "",
            text: "The default mode... just your regular basic average blast of confetti. But it's still a little cool, right?"
        } ],
        fn: function () {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    },

    {
        id: "random",
        name: "Random Direction",
        description: [ {
            cssClass: "",
            text: "Go crazy with some randomness. Shoot a random amount of confetti in random directions. (Go ahead... you know you want to click that button more than once.)"
        } ],
        fn: function () {
            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            confetti({
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                particleCount: randomInRange(50, 100),
                origin: { y: 0.6 },
            });
        }
    },

    {
        id: "realistic",
        name: "Realistic Look",
        description: [ {
            cssClass: "",
            text: "If you happened to get curious and changed the particle count to 400 or so, you saw something disappointing. An even \"flattened cone\" look to the confetti, making it look way too perfect and ruining the illusion. We can fix that by mixing a few effects together."
        } ],
        fn: function () {
            const count = 200,
                defaults = {
                    origin: { y: 0.7 },
                };

            function fire(particleRatio, opts) {
                confetti(
                    Object.assign({}, defaults, opts, {
                        particleCount: Math.floor(count * particleRatio),
                    })
                );
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });

            fire(0.2, {
                spread: 60,
            });

            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    },

    {
        id: "stars",
        name: "Stars",
        description: [ {
            cssClass: "",
            text: "You can combine multiple calls to confetti with any settings in order to create a more complex effect. Go ahead, combine different shapes, sizes, etc. Stagger them for an extra boost of excitement."
        }, {
            cssClass: "center",
            text: "✨ Celebrate with a burst of stars! ✨"
        } ],
        fn: function () {
            const defaults = {
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: [ "star" ],
                colors: [ "FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8" ],
            };

            function shoot() {
                confetti({
                    ...defaults,
                    particleCount: 40,
                    scalar: 1.2,
                    shapes: [ "star" ],
                });

                confetti({
                    ...defaults,
                    particleCount: 10,
                    scalar: 0.75,
                    shapes: [ "circle" ],
                });
            }

            setTimeout(shoot, 0);
            setTimeout(shoot, 100);
            setTimeout(shoot, 200);
        }
    },

    {
        id: "fireworks",
        name: "Fireworks",
        description: [ {
            cssClass: "",
            text: "Why click a button repeatedly when you can have code do it for you? Shoot some firework of confetti from the sides of page so you can still read the content in the center."
        } ],
        fn: function () {
            const duration = 15 * 1000,
                animationEnd = Date.now() + duration,
                defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                confetti(
                    Object.assign({}, defaults, {
                        particleCount,
                        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    })
                );
                confetti(
                    Object.assign({}, defaults, {
                        particleCount,
                        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    })
                );
            }, 250);
        }
    },

    {
        id: "snow",
        name: "Snow",
        description: [ {
            cssClass: "",
            text: "The effect is not limited to crazy rapid fire of confetti though. You can create a wintery mood with gently falling particles across the entire page."
        } ],
        fn: function () {
            const duration = 15 * 1000,
                animationEnd = Date.now() + duration;

            let skew = 1;

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            (function frame() {
                const timeLeft = animationEnd - Date.now(),
                    ticks = Math.max(200, 500 * (timeLeft / duration));

                skew = Math.max(0.8, skew - 0.001);

                confetti({
                    particleCount: 1,
                    startVelocity: 0,
                    ticks: ticks,
                    origin: {
                        x: Math.random(),
                        // since particles fall down, skew start toward the top
                        y: Math.random() * skew - 0.2,
                    },
                    colors: [ "#ffffff" ],
                    shapes: [ "circle" ],
                    gravity: randomInRange(0.4, 0.6),
                    scalar: randomInRange(0.4, 1),
                    drift: randomInRange(-0.4, 0.4),
                });

                if (timeLeft > 0) {
                    requestAnimationFrame(frame);
                }
            })();
        }
    },

    {
        id: "continuous",
        name: "School Pride",
        description: [ {
            cssClass: "",
            text: "But if you are into crazy rapid fire of confetti, what could be a better use than to show everyone what you are all about? Tell people where you are from with two confetti cannons from either side of the page."
        }, {
            cssClass: "center",
            text: "🌰 Go Buckeyes! 🌰"
        } ],
        fn: function () {
            const end = Date.now() + 15 * 1000;

            // go Buckeyes!
            const colors = [ "#bb0000", "#ffffff" ];

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                });

                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }
    },

    {
        id: "custom",
        name: "Custom Canvas",
        description: [ {
            cssClass: "",
            text: "But if you just hate confetti all over the place, there's something here for you as well. You can limit where the confetti appear by providing your own canvas element."
        } ],
        fn: function () {
            (async () => {
                const canvas = document.getElementById("my-canvas");

                // you should  only initialize a canvas once, so save this function
                // we'll save it to the canvas itself for the purpose of this demo
                canvas.confetti = canvas.confetti || (await confetti.create(canvas, { resize: true }));

                canvas.confetti({
                    spread: 70,
                    origin: { y: 1.2 },
                });
            })();
        }
    }
];

Handlebars.registerHelper("isCustom", function (value) {
    return value === "custom"
});

function pretty(val) {
    return js_beautify(val, { indent_size: 2, brace_style: "preserve-inline" });
}

function getCode(name) {
    // pretty-print the code, since we will use minified code in production
    const mode = modes.find(t => t.id === name);

    let code = pretty(mode.fn.toString());

    // take out the function wrapper, trim all whitespace
    code = code
        .split("\n")
        .slice(1)
        .slice(0, -1)
        .map(function (s) {
            return s.trim();
        })
        .join("\n");

    // pretty-print again
    return pretty(code);
}

window.onload = function () {
    const template = Handlebars.templates["confetti-modes"];

    document.getElementById('confetti-modes').innerHTML = template({ modes });

    Array.from(document.querySelectorAll(".group")).forEach(function (group) {
        const name = group.getAttribute("data-name"),
            button = group.querySelector(".run"),
            codeElem = group.querySelector(".editor"),
            editor = ace.edit(codeElem);

        editor.setTheme(themes[activeTheme]);

        editor.session.setMode("ace/mode/javascript");
        editor.session.setUseSoftTabs(true);
        editor.session.setTabSize(2);
        editor.session.setValue(getCode(name));

        const count = editor.session.getLength();

        // set height so that all code is visible
        codeElem.style.minHeight = 14 * count + 1 + "px";
        codeElem.style.height = count + "rem";

        button.onclick = function (ev) {
            // stop mobile browsers from zooming when clicking
            // buttons repeatedly really fast
            ev.preventDefault();

            try {
                eval(editor.getValue());
            } catch (e) {
                console.error(e);
            }
        };

        editors.push(editor);
    });
};
