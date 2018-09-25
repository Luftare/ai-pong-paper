const plot = (function(canvas, ctx){
  
  function plot(arr) {
    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    if(!arr.length) return;
    const max = arrayMax(arr);
    const len = Math.max(arr.length, 50);
    arr.forEach((val, i) => {
      const barWidth = (1 / len) * canvas.width;
      const barX = canvas.width * (i / len);
      const barY = canvas.height;
      const barHeight = (val / max) * canvas.height * 0.9
      ctx.fillRect(barX, barY, barWidth - 1, -barHeight);
      ctx.font= Math.round(360 / len) + "px Arial";
      const textSize = ctx.measureText(val);
      ctx.fillText(val, Math.round(barX + barWidth / 2 - textSize.width / 2), Math.round(canvas.height - barHeight) - 1);
    });
  }
  
  return plot;
})(
  document.getElementById("graph"),
  document.getElementById("graph").getContext("2d")
);

