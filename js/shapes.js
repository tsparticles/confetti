import { confettiTypes, updateShapesState } from "./state.js";

export const initShapes = () => {
  const btnCircle = document.getElementById("btnCircleConfetti");
  const btnSquare = document.getElementById("btnSquareConfetti");
  const btnTriangle = document.getElementById("btnTriangleConfetti");
  const btnPolygon = document.getElementById("btnPolygonConfetti");
  const btnEmoji = document.getElementById("btnEmojiConfetti");
  const btnImage = document.getElementById("btnImageConfetti");

  const updateCircleBtn = () => {
    if (confettiTypes.circle) {
      btnCircle.classList.add("active");
    } else {
      btnCircle.classList.remove("active");
    }
  };

  const updateSquareBtn = () => {
    if (confettiTypes.square) {
      btnSquare.classList.add("active");
    } else {
      btnSquare.classList.remove("active");
    }
  };

  const updateTriangleBtn = () => {
    if (confettiTypes.triangle) {
      btnTriangle.classList.add("active");
    } else {
      btnTriangle.classList.remove("active");
    }
  };

  const updatePolygonBtn = () => {
    if (confettiTypes.polygon.enable) {
      btnPolygon.classList.add("active");
    } else {
      btnPolygon.classList.remove("active");
    }
  };

  const updateEmojiBtn = () => {
    if (confettiTypes.emoji.enable) {
      btnEmoji.classList.add("active");
    } else {
      btnEmoji.classList.remove("active");
    }
  };

  const updateImageBtn = () => {
    if (confettiTypes.image.enable) {
      btnImage.classList.add("active");
    } else {
      btnImage.classList.remove("active");
    }
  };

  btnCircle.addEventListener("click", () => {
    updateShapesState({
      circle: !confettiTypes.circle,
    });

    updateCircleBtn();
  });

  btnSquare.addEventListener("click", () => {
    updateShapesState({
      square: !confettiTypes.square,
    });

    updateSquareBtn();
  });

  btnTriangle.addEventListener("click", () => {
    updateShapesState({
      triangle: !confettiTypes.triangle,
    });

    updateTriangleBtn();
  });

  btnPolygon.addEventListener("click", () => {
    updateShapesState({
      polygon: {
        enable: !confettiTypes.polygon.enable,
      },
    });

    updatePolygonBtn();
  });

  btnEmoji.addEventListener("click", () => {
    updateShapesState({
      emoji: {
        enable: !confettiTypes.emoji.enable,
      },
    });

    updateEmojiBtn();
  });

  btnImage.addEventListener("click", () => {
    updateShapesState({
      image: {
        enable: !confettiTypes.image.enable,
      },
    });

    updateImageBtn();
  });

  updateCircleBtn();
  updateSquareBtn();
  updateTriangleBtn();
  updatePolygonBtn();
  updateEmojiBtn();
  updateImageBtn();
};
