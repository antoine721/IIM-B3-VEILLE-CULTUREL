(() => {
    const TWO_PI = Math.PI * 2;

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    function makeRand(seed) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < seed.length; i++) {
            h ^= seed.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return () => {
            h += h << 13;
            h ^= h >>> 7;
            h += h << 3;
            h ^= h >>> 17;
            h += h << 5;
            return (h >>> 0) / 4294967295;
        };
    }

    function randBetween(rand, a, b) {
        return a + (b - a) * rand();
    }

    const renderers = {
        "jan-01": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#667eea";
                const count = 20;
                for (let i = 0; i < count; i++) {
                    ctx.save();
                    const x = rand() * w;
                    const y = rand() * h;
                    const size = randBetween(rand, 20, 60);
                    const rotation = t * (0.5 + i * 0.1);
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    ctx.scale(1 + Math.sin(t + i) * 0.2, 1 + Math.sin(t + i) * 0.2);
                    ctx.beginPath();
                    ctx.arc(0, 0, size, 0, TWO_PI);
                    ctx.fill();
                    ctx.restore();
                }
            }
        },
        "jan-02": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const ballX = w / 2 + Math.sin(t * 2) * (w / 3);
                const ballY = h / 2 + Math.abs(Math.sin(t * 2)) * 100;
                const squash = 1 - Math.abs(Math.sin(t * 2)) * 0.4;
                const stretch = 1 + Math.abs(Math.sin(t * 2)) * 0.2;
                const anticipation = Math.sin(t * 2 - 0.3) * 10;
                
                ctx.save();
                ctx.translate(ballX + anticipation, ballY);
                ctx.scale(stretch, squash);
                ctx.rotate(Math.sin(t * 2) * 0.3);
                ctx.fillStyle = "#fbbf24";
                ctx.beginPath();
                ctx.arc(0, 0, 40, 0, TWO_PI);
                ctx.fill();
                
                for (let i = 1; i < 5; i++) {
                    const trailX = -Math.cos(t * 2) * i * 15;
                    const trailY = -Math.abs(Math.sin(t * 2)) * i * 8;
                    ctx.globalAlpha = 0.3 / i;
                    ctx.beginPath();
                    ctx.arc(trailX, trailY, 30 / i, 0, TWO_PI);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.restore();
            }
        },
        "jan-03": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#1a1a2e";
                ctx.fillRect(0, 0, w, h);
                
                let fib = [1, 1];
                for (let i = 2; i < 15; i++) {
                    fib[i] = fib[i-1] + fib[i-2];
                }
                
                const cx = w / 2;
                const cy = h / 2;
                let angle = 0;
                let x = cx;
                let y = cy;
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(t * 0.2);
                ctx.translate(-cx, -cy);
                
                ctx.strokeStyle = "#667eea";
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                for (let i = 0; i < fib.length; i++) {
                    const radius = fib[i] * 6;
                    if (i === 0) ctx.moveTo(x + radius, y);
                    else ctx.arc(x, y, radius, angle, angle + Math.PI / 2);
                    x += Math.cos(angle) * radius;
                    y += Math.sin(angle) * radius;
                    angle += Math.PI / 2;
                }
                ctx.stroke();
                
                ctx.fillStyle = "rgba(102, 126, 234, 0.2)";
                x = cx;
                y = cy;
                angle = 0;
                for (let i = 0; i < Math.min(8, fib.length); i++) {
                    const size = fib[i] * 6;
                    ctx.fillRect(x - size/2, y - size/2, size, size);
                    x += Math.cos(angle) * size;
                    y += Math.sin(angle) * size;
                    angle += Math.PI / 2;
                }
                ctx.restore();
            }
        },
        "jan-04": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                const pixelSize = 25;
                const cols = Math.floor(w / pixelSize);
                const rows = Math.floor(h / pixelSize);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.3) * 0.1);
                ctx.translate(-w / 2, -h / 2);
                
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        const val = Math.floor(rand() * 256);
                        ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }
                ctx.restore();
            }
        },
        "jan-05": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const letters = {
                    'G': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[0,1,1,1,0]],
                    'E': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
                    'N': [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1]],
                    'U': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
                    'A': [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
                    'R': [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
                    'Y': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]]
                };
                
                const word = "GENUARY";
                const cellSize = 14;
                const startX = (w - (word.length * 6 * cellSize + (word.length - 1) * 15)) / 2;
                const startY = h / 2 - 3 * cellSize;
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.scale(1 + Math.sin(t) * 0.05, 1 + Math.sin(t) * 0.05);
                ctx.rotate(Math.sin(t * 0.5) * 0.1);
                ctx.translate(-w / 2, -h / 2);
                
                ctx.fillStyle = "#667eea";
                for (let i = 0; i < word.length; i++) {
                    const letter = letters[word[i]];
                    const x = startX + i * (6 * cellSize + 15);
                    for (let row = 0; row < letter.length; row++) {
                        for (let col = 0; col < letter[row].length; col++) {
                            if (letter[row][col] === 1) {
                                ctx.fillRect(x + col * cellSize, startY + row * cellSize, cellSize - 2, cellSize - 2);
                            }
                        }
                    }
                }
                ctx.restore();
            }
        },
        "jan-06": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                const lightsOn = Math.sin(t * 0.5) > 0;
                
                ctx.fillStyle = lightsOn ? "#fef3c7" : "#1e293b";
                ctx.fillRect(0, 0, w, h);
                
                const gridSize = 50;
                const cols = Math.floor((w - 100) / gridSize);
                const rows = Math.floor((h - 100) / gridSize);
                
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const x = 50 + i * gridSize;
                        const y = 50 + j * gridSize;
                        
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(Math.sin(t + i + j) * 0.2);
                        
                        if (lightsOn) {
                            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
                            grad.addColorStop(0, "#fbbf24");
                            grad.addColorStop(0.5, "#f59e0b");
                            grad.addColorStop(1, "transparent");
                            ctx.fillStyle = grad;
                            ctx.beginPath();
                            ctx.arc(0, 0, 25, 0, TWO_PI);
                            ctx.fill();
                            
                            ctx.fillStyle = "#fbbf24";
                            ctx.beginPath();
                            ctx.arc(0, 0, 18, 0, TWO_PI);
                            ctx.fill();
                        } else {
                            ctx.fillStyle = "#475569";
                            ctx.beginPath();
                            ctx.arc(0, 0, 15, 0, TWO_PI);
                            ctx.fill();
                        }
                        ctx.restore();
                    }
                }
            }
        },
        "jan-07": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const size = 100;
                const cx = w / 2;
                const cy = h / 2;
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(t * 0.3);
                ctx.translate(-cx, -cy);
                
                ctx.fillStyle = "rgba(102, 126, 234, 0.6)";
                ctx.beginPath();
                ctx.arc(cx - size * 0.6, cy, size, 0, TWO_PI);
                ctx.fill();
                
                ctx.fillStyle = "rgba(118, 75, 162, 0.6)";
                ctx.beginPath();
                ctx.arc(cx + size * 0.6, cy, size, 0, TWO_PI);
                ctx.fill();
                
                ctx.fillStyle = "#fbbf24";
                ctx.beginPath();
                ctx.arc(cx - size * 0.6, cy, size, 0, TWO_PI);
                ctx.arc(cx + size * 0.6, cy, size, 0, TWO_PI);
                ctx.fill("evenodd");
                
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 24px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("A", cx - size * 0.6, cy - size - 20);
                ctx.fillText("B", cx + size * 0.6, cy - size - 20);
                ctx.fillText("A ∩ B", cx, cy);
                ctx.restore();
            }
        },
        "jan-08": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, "#1e3a8a");
                grad.addColorStop(1, "#0f172a");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
                
                const buildings = [];
                let x = 0;
                while (x < w) {
                    const width = randBetween(rand, 40, 100);
                    const height = randBetween(rand, 150, 450);
                    buildings.push({x, width, height});
                    x += width + randBetween(rand, 5, 25);
                }
                
                for (const b of buildings) {
                    ctx.save();
                    const skew = Math.sin(t + b.x * 0.01) * 2;
                    ctx.transform(1, 0, skew, 1, b.x, h - b.height);
                    
                    const bGrad = ctx.createLinearGradient(0, 0, 0, b.height);
                    bGrad.addColorStop(0, `hsl(${randBetween(rand, 200, 250)}, 40%, ${randBetween(rand, 20, 50)}%)`);
                    bGrad.addColorStop(1, `hsl(${randBetween(rand, 200, 250)}, 40%, ${randBetween(rand, 10, 30)}%)`);
                    ctx.fillStyle = bGrad;
                    ctx.fillRect(0, 0, b.width, b.height);
                    
                    ctx.fillStyle = "#fbbf24";
                    for (let i = 0; i < b.height - 20; i += 35) {
                        for (let j = 10; j < b.width - 10; j += 25) {
                            if (rand() > 0.25) {
                                ctx.fillRect(j, i + 10, 15, 20);
                            }
                        }
                    }
                    ctx.restore();
                }
            }
        },
        "jan-09": {
            init(rand) {
                const cols = 100;
                const rows = 75;
                const grid = [];
                for (let i = 0; i < cols * rows; i++) {
                    grid[i] = rand() > 0.5 ? 1 : 0;
                }
                return { grid, cols, rows, generation: 0 };
            },
            draw(ctx, w, h, rand, t, state) {
                ctx.clearRect(0, 0, w, h);
                const { grid, cols, rows } = state;
                const cellW = w / cols;
                const cellH = h / rows;
                
                const newGrid = [...grid];
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        let neighbors = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const nx = (x + dx + cols) % cols;
                                const ny = (y + dy + rows) % rows;
                                neighbors += grid[ny * cols + nx];
                            }
                        }
                        newGrid[y * cols + x] = (neighbors % 2 === 1 || neighbors === 2 || neighbors === 3 || neighbors === 5 || neighbors === 7) ? 1 : 0;
                    }
                }
                state.grid = newGrid;
                state.generation++;
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.1) * 0.2);
                ctx.scale(1 + Math.sin(t * 0.2) * 0.05, 1 + Math.sin(t * 0.2) * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                const hue = (state.generation * 2) % 360;
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        if (grid[y * cols + x]) {
                            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                            ctx.fillRect(x * cellW, y * cellH, cellW + 1, cellH + 1);
                        }
                    }
                }
                ctx.restore();
            }
        },
        "jan-10": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(t * 0.1);
                
                ctx.strokeStyle = "#667eea";
                ctx.lineWidth = 2;
                for (let spiral = 0; spiral < 3; spiral++) {
                    ctx.beginPath();
                    const offset = (spiral * TWO_PI) / 3;
                    for (let angle = 0; angle < TWO_PI * 4; angle += 0.05) {
                        const r = (angle * 8) + Math.sin(angle * 5 + t) * 30;
                        const x = r * Math.cos(angle + offset);
                        const y = r * Math.sin(angle + offset);
                        if (angle === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
                
                ctx.strokeStyle = "rgba(102, 126, 234, 0.3)";
                ctx.lineWidth = 1;
                for (let r = 50; r < 200; r += 50) {
                    ctx.beginPath();
                    ctx.arc(0, 0, r, 0, TWO_PI);
                    ctx.stroke();
                }
                for (let angle = 0; angle < TWO_PI; angle += Math.PI / 6) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle) * 200, Math.sin(angle) * 200);
                    ctx.stroke();
                }
                ctx.restore();
            }
        },
        "jan-11": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.scale(1 + Math.sin(t) * 0.05, 1 + Math.sin(t) * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                ctx.fillStyle = "#667eea";
                ctx.font = "16px 'Courier New', monospace";
                ctx.textAlign = "left";
                const lines = [
                    "const quine = `",
                    "const quine = \\`",
                    "...",
                    "\\`;",
                    "console.log(quine);"
                ];
                lines.forEach((line, i) => {
                    ctx.fillText(line, 50, 100 + i * 30);
                });
                
                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 20px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("A program that outputs itself", w / 2, h / 2 + 100);
                ctx.restore();
            }
        },
        "jan-12": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const boxSize = 45;
                const cols = Math.floor((w - 40) / boxSize);
                const rows = Math.floor((h - 40) / boxSize);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.2) * 0.1);
                ctx.translate(-w / 2, -h / 2);
                
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const x = 20 + i * boxSize;
                        const y = 20 + j * boxSize;
                        const size = randBetween(rand, 25, 40);
                        const hue = randBetween(rand, 200, 280);
                        const sat = randBetween(rand, 60, 100);
                        const light = randBetween(rand, 40, 70);
                        
                        ctx.save();
                        ctx.translate(x + size/2, y + size/2);
                        ctx.rotate(Math.sin(t + i + j) * 0.3);
                        ctx.translate(-size/2, -size/2);
                        
                        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
                        ctx.fillRect(0, 0, size, size);
                        ctx.restore();
                    }
                }
                ctx.restore();
            }
        },
        "jan-13": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#f7fafc";
                ctx.fillRect(0, 0, w, h);
                
                const cx = w / 2;
                const cy = h / 2;
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.scale(1 + Math.sin(t * 0.5) * 0.05, 1 + Math.sin(t * 0.5) * 0.05);
                ctx.rotate(Math.sin(t * 0.3) * 0.1);
                ctx.translate(-cx, -cy);
                
                ctx.fillStyle = "#fbbf24";
                ctx.beginPath();
                ctx.ellipse(cx, cy, 110, 130, 0, 0, TWO_PI);
                ctx.fill();
                
                ctx.fillStyle = "#1a1a2e";
                for (let i = 0; i < 12; i++) {
                    const angle = (TWO_PI / 12) * i;
                    const x = cx + Math.cos(angle) * 90;
                    const y = cy - 100 + Math.sin(angle) * 20;
                    ctx.beginPath();
                    ctx.arc(x, y, 25, 0, TWO_PI);
                    ctx.fill();
                }
                
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.ellipse(cx - 35, cy - 15, 20, 25, 0, 0, TWO_PI);
                ctx.ellipse(cx + 35, cy - 15, 20, 25, 0, 0, TWO_PI);
                ctx.fill();
                
                ctx.fillStyle = "#1a1a2e";
                ctx.beginPath();
                ctx.arc(cx - 35, cy - 15, 12, 0, TWO_PI);
                ctx.arc(cx + 35, cy - 15, 12, 0, TWO_PI);
                ctx.fill();
                
                ctx.strokeStyle = "#1a1a2e";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(cx, cy + 5);
                ctx.lineTo(cx - 8, cy + 25);
                ctx.lineTo(cx + 8, cy + 25);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(cx, cy + 40, 25, 0, Math.PI);
                ctx.stroke();
                ctx.restore();
            }
        },
        "jan-14": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const cellSize = 60;
                const cols = Math.floor(w / cellSize);
                const rows = Math.floor(h / cellSize);
                
                const colors = ["#667eea", "#764ba2", "#fbbf24", "#10b981"];
                let colorIndex = 0;
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.1) * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const x = i * cellSize;
                        const y = j * cellSize;
                        ctx.fillStyle = colors[colorIndex % colors.length];
                        ctx.fillRect(x, y, cellSize, cellSize);
                        colorIndex++;
                    }
                }
                ctx.restore();
            }
        },
        "jan-15": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#f7fafc";
                ctx.fillRect(0, 0, w, h);
                
                const lightX = w / 2 + Math.sin(t) * 150;
                const lightY = h / 2 + Math.cos(t * 0.7) * 100;
                const objX = w / 2;
                const objY = h / 2;
                
                ctx.save();
                ctx.translate(objX, objY);
                ctx.rotate(Math.sin(t * 0.5) * 0.2);
                ctx.translate(-objX, -objY);
                
                for (let i = 0; i < 3; i++) {
                    const offset = (i - 1) * 80;
                    const shadowX = objX + offset + (objX - lightX) * 0.4;
                    const shadowY = objY + (objY - lightY) * 0.4;
                    
                    const grad = ctx.createRadialGradient(shadowX, shadowY, 0, shadowX, shadowY, 100);
                    grad.addColorStop(0, "rgba(0,0,0,0.5)");
                    grad.addColorStop(1, "rgba(0,0,0,0)");
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.ellipse(shadowX, shadowY, 120, 40, Math.atan2(objY - lightY, objX - lightX), 0, TWO_PI);
                    ctx.fill();
                }
                ctx.restore();
            }
        },
        "jan-16": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w / 2, h);
                const cellSize = 35;
                const cols = Math.floor((w / 2) / cellSize);
                const rows = Math.floor(h / cellSize);
                
                ctx.save();
                ctx.translate(w / 4, h / 2);
                ctx.scale(1 + Math.sin(t * 0.3) * 0.02, 1 + Math.sin(t * 0.3) * 0.02);
                ctx.translate(-w / 4, -h / 2);
                
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        ctx.fillStyle = "#667eea";
                        ctx.fillRect(i * cellSize + 5, j * cellSize + 5, cellSize - 10, cellSize - 10);
                    }
                }
                ctx.restore();
                
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(w / 2, 0, w / 2, h);
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const x = w / 2 + i * cellSize + randBetween(rand, -15, 15);
                        const y = j * cellSize + randBetween(rand, -15, 15);
                        const size = cellSize + randBetween(rand, -20, 10);
                        const hue = randBetween(rand, 0, 360);
                        
                        ctx.save();
                        ctx.translate(x + size/2, y + size/2);
                        ctx.rotate(rand() * TWO_PI);
                        ctx.translate(-size/2, -size/2);
                        
                        ctx.fillStyle = `hsl(${hue}, 70%, ${randBetween(rand, 30, 70)}%)`;
                        ctx.fillRect(0, 0, Math.max(10, size), Math.max(10, size));
                        ctx.restore();
                    }
                }
            }
        },
        "jan-17": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const size = 80;
                const hexHeight = Math.sqrt(3) * size;
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(t * 0.1);
                ctx.translate(-w / 2, -h / 2);
                
                ctx.strokeStyle = "#667eea";
                ctx.lineWidth = 2;
                ctx.fillStyle = "rgba(102, 126, 234, 0.2)";
                
                for (let row = -2; row < Math.ceil(h / hexHeight) + 2; row++) {
                    for (let col = -2; col < Math.ceil(w / size) + 2; col++) {
                        const x = col * size * 1.5;
                        const y = row * hexHeight + (col % 2) * hexHeight / 2;
                        
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = (Math.PI / 3) * i;
                            const px = x + size * Math.cos(angle);
                            const py = y + size * Math.sin(angle);
                            if (i === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }
        },
        "jan-18": {
            init(rand) {
                return { 
                    x: 100, 
                    y: 100, 
                    angle: Math.PI / 4,
                    path: [],
                    turns: 0
                };
            },
            draw(ctx, w, h, rand, t, state) {
                if (state.path.length % 50 === 0 && state.path.length > 0) {
                    state.angle += Math.PI / 2;
                    state.turns++;
                }
                
                if (state.x < 50 || state.x > w - 50 || state.y < 50 || state.y > h - 50) {
                    state.x = clamp(state.x, 50, w - 50);
                    state.y = clamp(state.y, 50, h - 50);
                    state.angle += Math.PI / 2;
                    state.turns++;
                }
                
                const step = 3;
                const newX = state.x + Math.cos(state.angle) * step;
                const newY = state.y + Math.sin(state.angle) * step;
                
                state.path.push({x: state.x, y: state.y});
                if (state.path.length > 2000) state.path.shift();
                
                state.x = newX;
                state.y = newY;
                
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.1) * 0.1);
                ctx.translate(-w / 2, -h / 2);
                
                ctx.strokeStyle = "#667eea";
                ctx.lineWidth = 3;
                ctx.beginPath();
                if (state.path.length > 1) {
                    ctx.moveTo(state.path[0].x, state.path[0].y);
                    for (let i = 1; i < state.path.length; i++) {
                        ctx.lineTo(state.path[i].x, state.path[i].y);
                    }
                }
                ctx.stroke();
                
                ctx.fillStyle = "#fbbf24";
                ctx.beginPath();
                ctx.arc(state.x, state.y, 8, 0, TWO_PI);
                ctx.fill();
                ctx.restore();
            }
        },
        "jan-19": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const gridSize = 16;
                const cellSize = Math.min(w, h) / gridSize;
                const startX = (w - gridSize * cellSize) / 2;
                const startY = (h - gridSize * cellSize) / 2;
                
                const colors = ["#667eea", "#764ba2", "#fbbf24", "#10b981"];
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.2) * 0.1);
                ctx.scale(1 + Math.sin(t * 0.3) * 0.02, 1 + Math.sin(t * 0.3) * 0.02);
                ctx.translate(-w / 2, -h / 2);
                
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        const colorIndex = (i + j) % colors.length;
                        ctx.fillStyle = colors[colorIndex];
                        ctx.fillRect(startX + i * cellSize, startY + j * cellSize, cellSize, cellSize);
                    }
                }
                ctx.restore();
            }
        },
        "jan-20": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(t * 0.1);
                ctx.scale(1 + Math.sin(t * 0.5) * 0.05, 1 + Math.sin(t * 0.5) * 0.05);
                
                ctx.strokeStyle = "#667eea";
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                const cx = 0;
                const cy = 0;
                let angle = 0;
                
                for (let i = 0; i < 2000; i++) {
                    const r = 50 + (i * 0.3) + Math.sin(i * 0.1) * 30;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    
                    angle += 0.05 + Math.sin(i * 0.01) * 0.02;
                }
                ctx.stroke();
                ctx.restore();
            }
        },
        "jan-21": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#fef3c7";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.2) * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                ctx.fillStyle = "#dc2626";
                ctx.fillRect(50, 50, 250, 350);
                
                ctx.fillStyle = "#fbbf24";
                ctx.beginPath();
                ctx.arc(450, 250, 120, 0, TWO_PI);
                ctx.fill();
                
                ctx.fillStyle = "#2563eb";
                ctx.fillRect(600, 400, 200, 150);
                
                ctx.fillStyle = "#1a1a2e";
                ctx.font = "bold 48px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("BAUHAUS", w / 2, h - 50);
                ctx.restore();
            }
        },
        "jan-22": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#f7fafc";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(t * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                ctx.strokeStyle = "#1a1a2e";
                ctx.lineWidth = 2;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                
                ctx.beginPath();
                const cx = w / 2;
                const cy = h / 2;
                for (let i = 0; i < 500; i++) {
                    const angle = i * 0.1;
                    const r = i * 0.5;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.restore();
            }
        },
        "jan-23": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const layers = [
                    {color: "rgba(102, 126, 234, 0.6)", x: 300, y: 200, size: 120},
                    {color: "rgba(118, 75, 162, 0.6)", x: 450, y: 200, size: 120},
                    {color: "rgba(251, 191, 36, 0.6)", x: 375, y: 320, size: 120},
                    {color: "rgba(16, 185, 129, 0.6)", x: 250, y: 350, size: 100},
                    {color: "rgba(239, 68, 68, 0.6)", x: 500, y: 350, size: 100}
                ];
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.3) * 0.1);
                ctx.scale(1 + Math.sin(t * 0.2) * 0.05, 1 + Math.sin(t * 0.2) * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                layers.forEach((layer, i) => {
                    ctx.save();
                    ctx.translate(layer.x, layer.y);
                    ctx.rotate(Math.sin(t + i) * 0.2);
                    ctx.translate(-layer.x, -layer.y);
                    
                    ctx.fillStyle = layer.color;
                    ctx.beginPath();
                    ctx.arc(layer.x, layer.y, layer.size, 0, TWO_PI);
                    ctx.fill();
                    ctx.restore();
                });
                ctx.restore();
            }
        },
        "jan-24": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#f7fafc";
                ctx.fillRect(0, 0, w, h);
                
                const cellSize = 42;
                const cols = Math.floor(w / cellSize);
                const rows = Math.floor(h / cellSize);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.1) * 0.05);
                ctx.translate(-w / 2, -h / 2);
                
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const offsetX = randBetween(rand, -3, 3);
                        const offsetY = randBetween(rand, -3, 3);
                        const size = cellSize + randBetween(rand, -4, 2);
                        const hue = 200 + randBetween(rand, -10, 10);
                        const sat = 50 + randBetween(rand, -5, 5);
                        const light = 70 + randBetween(rand, -5, 5);
                        
                        ctx.save();
                        ctx.translate(i * cellSize + cellSize/2, j * cellSize + cellSize/2);
                        ctx.rotate(Math.sin(t + i + j) * 0.1);
                        ctx.translate(-cellSize/2, -cellSize/2);
                        
                        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
                        ctx.fillRect(
                            offsetX, 
                            offsetY, 
                            Math.max(30, size), 
                            Math.max(30, size)
                        );
                        ctx.restore();
                    }
                }
                ctx.restore();
            }
        },
        "jan-25": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                const cx = w / 2;
                const cy = h / 2;
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(t * 0.2);
                ctx.scale(1 + Math.sin(t * 0.5) * 0.1, 1 + Math.sin(t * 0.5) * 0.1);
                ctx.translate(-cx, -cy);
                
                ctx.fillStyle = "#667eea";
                for (let i = 0; i < 25; i++) {
                    const angle = (TWO_PI / 25) * i;
                    const radius = 80 + 40 * Math.sin(angle * 3);
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    ctx.beginPath();
                    ctx.arc(x, y, 35, 0, TWO_PI);
                    ctx.fill();
                }
                
                ctx.fillStyle = "#764ba2";
                for (let i = 0; i < 15; i++) {
                    const x = rand() * w;
                    const y = rand() * h;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 25, y - 30);
                    ctx.lineTo(x + 50, y);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            }
        },
        "jan-26": {
            draw(ctx, w, h, rand, t) {
                function drawRecursiveGrid(x, y, width, height, depth, maxDepth) {
                    if (depth <= 0) return;
                    
                    ctx.strokeStyle = `hsl(${200 + (maxDepth - depth) * 20}, 70%, ${50 + depth * 10}%)`;
                    ctx.lineWidth = depth;
                    ctx.strokeRect(x, y, width, height);
                    
                    if (depth > 1) {
                        const newW = width / 2;
                        const newH = height / 2;
                        drawRecursiveGrid(x, y, newW, newH, depth - 1, maxDepth);
                        drawRecursiveGrid(x + newW, y, newW, newH, depth - 1, maxDepth);
                        drawRecursiveGrid(x, y + newH, newW, newH, depth - 1, maxDepth);
                        drawRecursiveGrid(x + newW, y + newH, newW, newH, depth - 1, maxDepth);
                    }
                }
                
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(t * 0.1) * 0.1);
                ctx.scale(1 + Math.sin(t * 0.2) * 0.03, 1 + Math.sin(t * 0.2) * 0.03);
                ctx.translate(-w / 2, -h / 2);
                
                drawRecursiveGrid(0, 0, w, h, 5, 5);
                ctx.restore();
            }
        },
        "jan-27": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(t * 0.3);
                
                const growth = 60 + Math.sin(t * 1.5) * 30;
                const pulse = 1 + Math.sin(t * 3) * 0.2;
                
                ctx.fillStyle = "#667eea";
                ctx.beginPath();
                ctx.arc(0, 0, growth * pulse, 0, TWO_PI);
                ctx.fill();
                
                ctx.strokeStyle = "#764ba2";
                ctx.lineWidth = 3;
                const branches = 12;
                for (let i = 0; i < branches; i++) {
                    const angle = (TWO_PI / branches) * i + t * 0.5;
                    const length = growth * (0.8 + Math.sin(t * 2 + i) * 0.3);
                    const x = Math.cos(angle) * length;
                    const y = Math.sin(angle) * length;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    
                    ctx.fillStyle = "#fbbf24";
                    ctx.beginPath();
                    ctx.arc(x, y, 8 + growth * 0.05, 0, TWO_PI);
                    ctx.fill();
                }
                ctx.restore();
            }
        },
        "jan-28": {
            draw(ctx, w, h) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#f7fafc";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#1a1a2e";
                ctx.font = "24px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("See HTML elements below", w / 2, h / 2);
            },
            animated: false
        },
        "jan-29": {
            init(rand) {
                const organisms = [];
                for (let i = 0; i < 30; i++) {
                    organisms.push({
                        x: rand() * 800,
                        y: rand() * 600,
                        size: randBetween(rand, 8, 25),
                        color: randBetween(rand, 0, 360),
                        speed: randBetween(rand, 0.5, 2),
                        angle: rand() * TWO_PI,
                        rotation: rand() * TWO_PI
                    });
                }
                return { organisms, generation: 0, lastMutation: 0 };
            },
            draw(ctx, w, h, rand, t, state) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                if (t - state.lastMutation > 2) {
                    state.generation++;
                    state.lastMutation = t;
                    for (const org of state.organisms) {
                        if (rand() < 0.15) {
                            org.size = Math.max(5, org.size + randBetween(rand, -3, 5));
                            org.color = (org.color + randBetween(rand, -30, 30) + 360) % 360;
                            org.speed = Math.max(0.3, org.speed + randBetween(rand, -0.3, 0.3));
                        }
                    }
                }
                
                for (const org of state.organisms) {
                    org.x += Math.cos(org.angle) * org.speed;
                    org.y += Math.sin(org.angle) * org.speed;
                    org.rotation += 0.05;
                    
                    if (org.x < 0 || org.x > w) org.angle = Math.PI - org.angle;
                    if (org.y < 0 || org.y > h) org.angle = -org.angle;
                    
                    ctx.save();
                    ctx.translate(org.x, org.y);
                    ctx.rotate(org.rotation);
                    
                    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, org.size * 2);
                    grad.addColorStop(0, `hsl(${org.color}, 80%, 70%)`);
                    grad.addColorStop(1, "transparent");
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(0, 0, org.size * 2, 0, TWO_PI);
                    ctx.fill();
                    
                    ctx.fillStyle = `hsl(${org.color}, 70%, 60%)`;
                    ctx.beginPath();
                    ctx.arc(0, 0, org.size, 0, TWO_PI);
                    ctx.fill();
                    ctx.restore();
                }
            }
        },
        "jan-30": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#0a0a0d";
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(t * 0.8);
                
                for (let layer = 0; layer < 5; layer++) {
                    ctx.save();
                    ctx.rotate(layer * Math.PI / 5 + t * (0.2 + layer * 0.1));
                    ctx.scale(1 + Math.sin(t + layer) * 0.1, 1 + Math.sin(t + layer) * 0.1);
                    
                    ctx.fillStyle = `hsl(${200 + layer * 20}, 70%, ${50 + layer * 5}%)`;
                    for (let i = 0; i < 8; i++) {
                        const angle = (TWO_PI / 8) * i;
                        const dist = 80 + layer * 20;
                        const x = Math.cos(angle) * dist;
                        const y = Math.sin(angle) * dist;
                        ctx.fillRect(x - 12, y - 12, 24, 24);
                    }
                    ctx.restore();
                }
                ctx.restore();
            }
        },
        "jan-31": {
            draw(ctx, w, h, rand, t) {
                ctx.clearRect(0, 0, w, h);
                
                const cx = w / 2;
                const cy = h / 2;
                
                const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
                bgGrad.addColorStop(0, "#667eea");
                bgGrad.addColorStop(0.4, "#764ba2");
                bgGrad.addColorStop(0.7, "#1a1a2e");
                bgGrad.addColorStop(1, "#0a0a0d");
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, w, h);
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(t * 0.2);
                ctx.scale(1 + Math.sin(t * 0.5) * 0.1, 1 + Math.sin(t * 0.5) * 0.1);
                
                ctx.fillStyle = "rgba(251, 191, 36, 0.4)";
                for (let i = 0; i < 30; i++) {
                    const angle = (TWO_PI / 30) * i + t;
                    const radius = 100 + Math.sin(t * 2 + i) * 50;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const size = 15 + Math.sin(t * 3 + i) * 10;
                    
                    const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
                    grad.addColorStop(0, "rgba(251, 191, 36, 0.8)");
                    grad.addColorStop(1, "transparent");
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, TWO_PI);
                    ctx.fill();
                }
                
                ctx.strokeStyle = "rgba(102, 126, 234, 0.6)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let x = -w/2; x < w/2; x += 2) {
                    const y = Math.sin((x / w) * TWO_PI * 4 + t * 2) * 30;
                    if (x === -w/2) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.restore();
            }
        }
    };

    function initPrompt(promptId) {
        const canvas = document.getElementById("art");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rand = makeRand(promptId);
        let w = 0;
        let h = 0;

        const renderer = renderers[promptId];
        if (!renderer) {
            ctx.fillStyle = "#f44";
            ctx.fillText("Aucun renderer pour " + promptId, 20, 20);
            return;
        }

        const state = renderer.init ? renderer.init(rand) : {};

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            w = rect.width;
            h = rect.height;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resize();
        window.addEventListener("resize", resize);

        function frame(time) {
            renderer.draw(ctx, w, h, rand, (time || 0) / 1000, state);
            if (renderer.animated !== false) {
                requestAnimationFrame(frame);
            }
        }

        renderer.draw(ctx, w, h, rand, 0, state);
        if (renderer.animated !== false) {
            requestAnimationFrame(frame);
        }
    }

    window.initPrompt = initPrompt;
})();
