/* ==========================================================================
   IOUBI Web Portal - Central Application Engine & Simulators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Navigation & View Routing
    // ----------------------------------------------------------------------
    const navButtons = document.querySelectorAll('.nav-btn');
    const routerCards = document.querySelectorAll('.router-card');
    const ctaButtons = document.querySelectorAll('.hero-cta-group button');
    const pageViews = document.querySelectorAll('.page-view');

    function switchPage(targetId) {
        pageViews.forEach(view => {
            if (view.id === `page-${targetId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        navButtons.forEach(btn => {
            if (btn.dataset.target === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        window.location.hash = targetId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger canvas resize if on topology view
        if (targetId === 'architecture') {
            setTimeout(resizeTopologyCanvas, 100);
        }
    }

    // Event listeners for top nav
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.dataset.target));
    });

    // Event listeners for footer router cards
    routerCards.forEach(card => {
        card.addEventListener('click', () => switchPage(card.dataset.target));
    });

    // CTA buttons
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.dataset.target));
    });

    // Handle hash on page load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(`page-${initialHash}`)) {
        switchPage(initialHash);
    }

    // ----------------------------------------------------------------------
    // 2. Background Particle Network Canvas Animation
    // ----------------------------------------------------------------------
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 45;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateBg() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateBg);
        }
        animateBg();

        window.addEventListener('resize', () => {
            width = bgCanvas.width = window.innerWidth;
            height = bgCanvas.height = window.innerHeight;
        });
    }

    // ----------------------------------------------------------------------
    // 3. Interactive Sankey Diagram Visualizer Engine (Blueprint Page)
    // ----------------------------------------------------------------------
    const sankeyContainer = document.getElementById('sankey-container');
    if (sankeyContainer) {
        function renderSankey() {
            sankeyContainer.innerHTML = `
                <svg width="100%" height="100%" viewBox="0 0 800 240" preserveAspectRatio="none" style="overflow: visible;">
                    <defs>
                        <linearGradient id="grad-comm" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="var(--accent-indigo)" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="var(--accent-cyan)" stop-opacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="grad-ind" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="var(--accent-cyan)" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="grad-div" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="var(--accent-magenta)"/>
                            <stop offset="100%" stop-color="#e11d48"/>
                        </linearGradient>
                    </defs>

                    <!-- Main Commercial Stream (70 Parts) -->
                    <path d="M 40 40 C 250 40, 350 70, 500 70 L 500 170 C 350 170, 250 160, 40 160 Z" fill="url(#grad-comm)"/>
                    <text x="50" y="105" fill="#ffffff" font-size="14" font-weight="700">Commercial Supply Engine (70x Velocity)</text>

                    <!-- Individual Stream (1 Part) -->
                    <path d="M 40 185 C 250 185, 350 185, 500 185 L 500 205 C 350 205, 250 205, 40 205 Z" fill="url(#grad-ind)"/>
                    <text x="50" y="198" fill="#ffffff" font-size="11" font-weight="600">Individual Favors (1x)</text>

                    <!-- Shaved 1.4% Sliver Routing to Dividend Pool -->
                    <path d="M 420 120 Q 550 120, 680 180 L 760 180 L 760 220 L 670 220 Q 520 160, 420 140 Z" fill="url(#grad-div)"/>

                    <!-- Nodes -->
                    <rect x="750" y="50" width="40" height="170" rx="6" fill="var(--accent-cyan)" opacity="0.9"/>
                    <text x="770" y="135" fill="var(--bg-dark)" font-size="12" font-weight="800" text-anchor="middle" writing-mode="tb">HUMAN BASELINE POOL</text>
                </svg>
            `;
        }
        renderSankey();
    }

    // ----------------------------------------------------------------------
    // 4. Interactive Node Topology Canvas Engine (Architecture Map Page)
    // ----------------------------------------------------------------------
    const topoCanvas = document.getElementById('topology-canvas');
    const inspectorContent = document.getElementById('inspector-content');

    if (topoCanvas) {
        const ctx = topoCanvas.getContext('2d');
        let width, height;

        function resizeTopologyCanvas() {
            const container = topoCanvas.parentElement;
            width = topoCanvas.width = container.clientWidth;
            height = topoCanvas.height = container.clientHeight;
            drawTopology();
        }

        const nodes = [
            { id: 1, label: 'Deltar Core', type: 'core', x: 0.5, y: 0.5, desc: 'Central routing protocol vector.' },
            { id: 2, label: 'Commercial Engine', type: 'commercial', x: 0.25, y: 0.35, desc: 'High-velocity 70x enterprise supply chain stream.' },
            { id: 3, label: 'Individual Node A', type: 'individual', x: 0.3, y: 0.7, desc: 'P2P favor exchanger emitting 3-minute units.' },
            { id: 4, label: 'Individual Node B', type: 'individual', x: 0.75, y: 0.65, desc: 'Recipient node receiving split favor contributions.' },
            { id: 5, label: 'Automatic Dividend Pool', type: 'dividend', x: 0.75, y: 0.3, desc: 'Shared reservoir distributing collective human basic dividends.' },
            { id: 6, label: '1% Log Scaling Relay', type: 'relay', x: 0.5, y: 0.25, desc: 'Calculates Log10 balance zeros to adjust favor sliver.' }
        ];

        const edges = [
            { from: 2, to: 1, label: '70x Volume' },
            { from: 3, to: 1, label: 'Favors' },
            { from: 1, to: 6, label: '1% per zero' },
            { from: 6, to: 5, label: 'Dividend Split' },
            { from: 5, to: 3, label: 'Human Baseline Payout' },
            { from: 5, to: 4, label: 'Human Baseline Payout' }
        ];

        let currentPreset = 'deltar';
        let hoverNode = null;

        function drawTopology() {
            if (!width || !height) return;
            ctx.clearRect(0, 0, width, height);

            // Draw Edges
            edges.forEach(edge => {
                const source = nodes.find(n => n.id === edge.from);
                const target = nodes.find(n => n.id === edge.to);

                const sx = source.x * width;
                const sy = source.y * height;
                const tx = target.x * width;
                const ty = target.y * height;

                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(tx, ty);

                if (currentPreset === 'deltar' && (edge.from === 1 || edge.to === 1)) {
                    ctx.strokeStyle = 'var(--accent-cyan)';
                    ctx.lineWidth = 2.5;
                } else if (currentPreset === 'dividend' && edge.to === 5) {
                    ctx.strokeStyle = 'var(--accent-magenta)';
                    ctx.lineWidth = 3;
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 1;
                }
                ctx.stroke();
            });

            // Draw Nodes
            nodes.forEach(node => {
                const nx = node.x * width;
                const ny = node.y * height;

                ctx.beginPath();
                ctx.arc(nx, ny, hoverNode === node ? 22 : 18, 0, Math.PI * 2);

                if (node.type === 'core') ctx.fillStyle = '#00f0ff';
                else if (node.type === 'commercial') ctx.fillStyle = '#6366f1';
                else if (node.type === 'dividend') ctx.fillStyle = '#f43f5e';
                else ctx.fillStyle = '#38bdf8';

                ctx.shadowBlur = hoverNode === node ? 20 : 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Label
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, nx, ny + 32);
            });
        }

        topoCanvas.addEventListener('mousemove', (e) => {
            const rect = topoCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            let found = null;
            nodes.forEach(node => {
                const nx = node.x * width;
                const ny = node.y * height;
                const dist = Math.sqrt((mx - nx) ** 2 + (my - ny) ** 2);
                if (dist < 25) found = node;
            });

            hoverNode = found;
            drawTopology();

            if (found) {
                inspectorContent.innerHTML = `
                    <h5 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 0.3rem;">${found.label}</h5>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${found.desc}</p>
                `;
            }
        });

        // Preset Button Listeners
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPreset = btn.dataset.preset;
                drawTopology();
            });
        });

        window.addEventListener('resize', resizeTopologyCanvas);
    }

    // ----------------------------------------------------------------------
    // 5. Interactive Tool 1: 1% Per Zero Calculator (Sandbox Page)
    // ----------------------------------------------------------------------
    const inputBalA = document.getElementById('input-bal-a');
    const inputBalB = document.getElementById('input-bal-b');
    const inputDuration = document.getElementById('input-duration');

    const zerosA = document.getElementById('zeros-a');
    const zerosB = document.getElementById('zeros-b');
    const favorsExchanged = document.getElementById('favors-exchanged');

    const resRate = document.getElementById('res-rate');
    const resContrib = document.getElementById('res-contrib');
    const resDividend = document.getElementById('res-dividend');

    function calculatePerZero() {
        if (!inputBalA || !inputBalB || !inputDuration) return;

        const balA = parseFloat(inputBalA.value) || 1;
        const balB = parseFloat(inputBalB.value) || 1;
        const duration = parseFloat(inputDuration.value) || 3;

        const logA = Math.max(0, Math.log10(balA));
        const logB = Math.max(0, Math.log10(balB));

        if (zerosA) zerosA.textContent = logA.toFixed(2);
        if (zerosB) zerosB.textContent = logB.toFixed(2);

        const favors = duration / 3;
        if (favorsExchanged) favorsExchanged.textContent = favors.toFixed(1);

        // Effective contribution percentage: 1% * (1 + average zeros)
        const avgZeros = (logA + logB) / 2;
        const effectiveRatePct = 1.0 + avgZeros;

        const sharedContrib = favors * (effectiveRatePct / 100);
        const dividend = sharedContrib / 2;

        if (resRate) resRate.textContent = `${effectiveRatePct.toFixed(2)}%`;
        if (resContrib) resContrib.textContent = `${sharedContrib.toFixed(3)} Favors`;
        if (resDividend) resDividend.textContent = `${dividend.toFixed(3)} Favors`;
    }

    if (inputBalA) {
        [inputBalA, inputBalB, inputDuration].forEach(el => {
            el.addEventListener('input', calculatePerZero);
        });
        calculatePerZero();
    }

    // ----------------------------------------------------------------------
    // 6. Interactive Tool 2: Test the Equilibrium Simulator (Sandbox Page)
    // ----------------------------------------------------------------------
    const sliderRatio = document.getElementById('slider-ratio');
    const sliderFriction = document.getElementById('slider-friction');
    const sliderNodes = document.getElementById('slider-nodes');

    const valRatio = document.getElementById('val-ratio');
    const valFriction = document.getElementById('val-friction');
    const valNodes = document.getElementById('val-nodes');

    const eqCommercialVol = document.getElementById('eq-commercial-vol');
    const eqPoolTotal = document.getElementById('eq-pool-total');
    const eqDividendPerNode = document.getElementById('eq-dividend-per-node');

    function calculateEquilibrium() {
        if (!sliderRatio || !sliderFriction || !sliderNodes) return;

        const ratio = parseInt(sliderRatio.value, 10);
        const frictionPct = parseFloat(sliderFriction.value);
        const nodesCount = parseInt(sliderNodes.value, 10);

        if (valRatio) valRatio.textContent = `${ratio} : 1`;
        if (valFriction) valFriction.textContent = `${frictionPct.toFixed(2)}%`;
        if (valNodes) valNodes.textContent = nodesCount.toLocaleString();

        const individualVolumePerDay = nodesCount * 1; // 1 favor per node per day
        const commercialVolumePerDay = individualVolumePerDay * ratio;

        const totalSystemicVolume = individualVolumePerDay + commercialVolumePerDay;
        const dailyPoolContribution = totalSystemicVolume * (frictionPct / 100);
        const dividendPerNode = dailyPoolContribution / nodesCount;

        if (eqCommercialVol) eqCommercialVol.textContent = `${Math.round(commercialVolumePerDay).toLocaleString()} Favors/day`;
        if (eqPoolTotal) eqPoolTotal.textContent = `${Math.round(dailyPoolContribution).toLocaleString()} Favors/day`;
        if (eqDividendPerNode) eqDividendPerNode.textContent = `${dividendPerNode.toFixed(3)} Favors/day`;
    }

    if (sliderRatio) {
        [sliderRatio, sliderFriction, sliderNodes].forEach(el => {
            el.addEventListener('input', calculateEquilibrium);
        });
        calculateEquilibrium();
    }
});
