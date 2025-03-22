export const animationState = {
  bottom: false,
  explosions: false,
  side: false,
  falling: false,
  singleExplosion: false,
};

export const appState = {
  singleTimeout: null,
  code: false,
};

export const confettiTypes = {
  circle: true,
  square: true,
  triangle: false,
  polygon: {
    enable: false,
    shapes: [
      {
        sides: 5,
      },
      {
        sides: 6,
      },
    ],
  },
  emoji: {
    enable: false,
    value: ["💩", "🤡", "🍀", "🍙", "🦄", "⭐️"],
  },
  image: {
    enable: false,
    sources: [
      {
        src: "https://particles.js.org/images/fruits/apple.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/avocado.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/banana.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/berries.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/cherry.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/grapes.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/lemon.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/orange.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/peach.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/pear.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/pepper.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/plum.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/star.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/strawberry.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/watermelon.png",
        width: 32,
        height: 32,
      },
      {
        src: "https://particles.js.org/images/fruits/watermelon_slice.png",
        width: 32,
        height: 32,
      },
    ],
  },
};

export const animationStateButtons = [];

export const updateAnimationState = (newAnimationState) => {
  _.merge(animationState, newAnimationState);

  if (
    Object.values(animationState).every((t) =>
      typeof t === "boolean" ? !t : true
    )
  ) {
    const container = tsParticles.domItem(0);

    if (container) {
      container.destroy();
    }
  }

  for (const stateButton of animationStateButtons) {
    stateButton.toggle(stateButton.status());

    if (stateButton.status()) {
      stateButton.button.classList.add("active");
    } else {
      stateButton.button.classList.remove("active");
    }
  }

  if (appState.singleTimeout) {
    clearTimeout(appState.singleTimeout);

    appState.singleTimeout = null;
  }

  if (animationState.singleExplosion) {
    appState.singleTimeout = setTimeout(() => {
      updateAnimationState({
        bottom: false,
        explosions: false,
        side: false,
        falling: false,
        singleExplosion: false,
      });
    }, 5000);
  }
};

export const updateState = (newState) => {
  _.merge(appState, newState);

  const codeEl = document.getElementById("code");

  if (appState.code) {
    codeEl.classList.remove("d-none");
  } else {
    codeEl.classList.add("d-none");
  }
};

export const updateCode = (newCode) => {
  const codeEl = document.getElementById("code-text");

  codeEl.innerHTML = newCode;
};

export const getParticlesShapes = () => {
  const type = [];
  const options = {};

  if (confettiTypes.circle) {
    type.push("circle");
  }

  if (confettiTypes.square) {
    type.push("square");
  }

  if (confettiTypes.triangle) {
    type.push("triangle");
  }

  if (confettiTypes.polygon.enable) {
    type.push("polygon");

    options.polygon = confettiTypes.polygon.shapes;
  }

  if (confettiTypes.emoji.enable) {
    type.push("emoji");

    if (!options.emoji) {
      options.emoji = {
        particles: {
          size: {
            value: 8,
          },
        },
      };
    }

    options.emoji.value = confettiTypes.emoji.value;
  }

  if (confettiTypes.image.enable) {
    type.push("image");

    options.image = confettiTypes.image.sources.map((t) => {
      return {
        ...t,
        particles: {
          size: {
            value: Math.min(t.width, t.height) / 2,
          },
        },
      };
    });
  }

  return {
    type: type.length === 1 ? type[0] : type,
    options,
  };
};

export const updateShapesState = (newShapeState) => {
  _.merge(confettiTypes, newShapeState);

  updateAnimationState(appState);
};
