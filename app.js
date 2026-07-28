/* ==========================================================================
   IOUBI Web Portal - Single-Page Linear Application Engine & Simulators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Background Particle Network Canvas Animation
    // ----------------------------------------------------------------------
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 45;

        class Particle {
            constructor() { this.reset(); }
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

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animateBg() {
            ctx.clearRect(0, 0, width, height);
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
    // 2. Interactive Tool 1: 1% Per Zero Calculator (Sandbox)
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

        const avgZeros = (logA + logB) / 2;
        const effectiveRatePct = Math.min(9.0, Math.max(1.0, 1.0 + avgZeros));

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
    // 3. Interactive Tool 2: Test Equilibrium Simulator (Sandbox)
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

        const individualVolumePerDay = nodesCount * 1;
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

    // ----------------------------------------------------------------------
    // 4. Interactive Tool 3: SCL Business Crowdfund Simulator
    // ----------------------------------------------------------------------
    const inputPCL = document.getElementById('input-pcl');
    const sliderDonors = document.getElementById('slider-donors');
    const sliderQuarters = document.getElementById('slider-quarters');

    const sclDailyRate = document.getElementById('scl-daily-rate');
    const valDonors = document.getElementById('val-donors');
    const valQuarters = document.getElementById('val-quarters');

    const sclTotalRaised = document.getElementById('scl-total-raised');
    const sclActiveLimit = document.getElementById('scl-active-limit');

    const barQ1 = document.getElementById('bar-q1');
    const barQ2 = document.getElementById('bar-q2');
    const barQ3 = document.getElementById('bar-q3');
    const barQ4 = document.getElementById('bar-q4');

    function calculateSCL() {
        if (!inputPCL || !sliderDonors || !sliderQuarters) return;

        const pcl = parseFloat(inputPCL.value) || 36500;
        const donors = parseInt(sliderDonors.value, 10);
        const quarters = parseInt(sliderQuarters.value, 10);

        const dailySCLPerPerson = pcl / 365;
        if (sclDailyRate) sclDailyRate.textContent = `${dailySCLPerPerson.toFixed(1)} SCL/day`;
        if (valDonors) valDonors.textContent = `${donors} Donors`;

        const quarterLabels = ['Q0 (Initial Raised)', 'Q1 (3 Months Elapsed)', 'Q2 (6 Months Elapsed)', 'Q3 (9 Months Elapsed)', 'Q4 (12 Months - Expired)'];
        if (valQuarters) valQuarters.textContent = quarterLabels[quarters];

        const raisedPerPerson = dailySCLPerPerson * 1;
        const totalRaised = raisedPerPerson * donors * 100;
        const decayFactor = Math.max(0, 1 - (quarters * 0.25));
        const activeLimit = totalRaised * decayFactor;

        if (sclTotalRaised) sclTotalRaised.textContent = `${Math.round(totalRaised).toLocaleString()} SCL`;
        if (sclActiveLimit) sclActiveLimit.textContent = `${Math.round(activeLimit).toLocaleString()} SCL`;

        if (barQ1) barQ1.style.width = quarters >= 1 ? '0%' : '75%';
        if (barQ2) barQ2.style.width = quarters >= 2 ? '0%' : '50%';
        if (barQ3) barQ3.style.width = quarters >= 3 ? '0%' : '25%';
        if (barQ4) barQ4.style.width = '0%';
    }

    if (inputPCL) {
        [inputPCL, sliderDonors, sliderQuarters].forEach(el => {
            el.addEventListener('input', calculateSCL);
        });
        calculateSCL();
    }
});
