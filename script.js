document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('isometric-canvas');
    const ctx = canvas.getContext('2d');

    const tileSize = 60;
    let grid, rows, cols;
    let hoverTile = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        rows = Math.ceil(canvas.height / (tileSize / 2)) + 2;
        cols = Math.ceil(canvas.width / tileSize) + 2;
        initializeGrid();
    }

    function initializeGrid() {
        grid = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < cols; x++) {
                grid[y][x] = {
                    baseColor: `hsl(${Math.random() * 360}, 50%, 50%)`,
                    hoverOffset: 0
                };
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const tile = grid[y][x];

                // Calculate isometric position
                const isoX = (x - y) * (tileSize / 2) + canvas.width / 2 - tileSize;
                const isoY = (x + y) * (tileSize / 4) - tileSize + tile.hoverOffset;

                // Adjust hover effect
                if (hoverTile && x === hoverTile.x && y === hoverTile.y) {
                    tile.hoverOffset += ( -20 - tile.hoverOffset) * 0.1;
                } else {
                    tile.hoverOffset += (0 - tile.hoverOffset) * 0.1;
                }
                
                // Drawing the isometric tile
                ctx.beginPath();
                ctx.moveTo(isoX, isoY);
                ctx.lineTo(isoX + tileSize / 2, isoY + tileSize / 4);
                ctx.lineTo(isoX, isoY + tileSize / 2);
                ctx.lineTo(isoX - tileSize / 2, isoY + tileSize / 4);
                ctx.closePath();

                // Fill and stroke
                ctx.fillStyle = tile.baseColor;
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
            }
        }

        requestAnimationFrame(draw);
    }

    function getTileFromCoords(mouseX, mouseY) {
        // Reverse isometric projection math to find the tile
        const invIsoX = (mouseX - canvas.width / 2 + tileSize);
        const invIsoY = (mouseY + tileSize);
        const invX = (invIsoX / (tileSize / 2) + invIsoY / (tileSize / 4)) / 2;
        const invY = (invIsoY / (tileSize / 4) - invIsoX / (tileSize / 2)) / 2;
        
        const x = Math.floor(invX);
        const y = Math.floor(invY);
        
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            return { x, y };
        }
        return null;
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        hoverTile = getTileFromCoords(mouseX, mouseY);
    });

    canvas.addEventListener('click', (e) => {
        const tile = getTileFromCoords(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
        if (tile) {
            alert(`Clicked tile at grid position (${tile.x}, ${tile.y})`);
            // You can implement custom logic here, like navigating to a new page.
        }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();
});
