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
    // 2. Transaction Fee Calculator
    // ----------------------------------------------------------------------
    const inputBalA = document.getElementById('input-bal-a');
    const sliderBalA = document.getElementById('slider-bal-a');
    const inputBalB = document.getElementById('input-bal-b');
    const sliderBalB = document.getElementById('slider-bal-b');

    const contribA = document.getElementById('contrib-a');
    const contribB = document.getElementById('contrib-b');
    const resRate = document.getElementById('res-rate');

    const inputConversionRate = document.getElementById('input-conversion-rate');
    const inputTxAmount = document.getElementById('input-tx-amount');
    const txTimeEquiv = document.getElementById('tx-time-equiv');

    const tblPaid = document.getElementById('tbl-paid');
    const tblPaidTime = document.getElementById('tbl-paid-time');
    const tblFee = document.getElementById('tbl-fee');
    const tblFeeTime = document.getElementById('tbl-fee-time');
    const tblReceived = document.getElementById('tbl-received');
    const tblReceivedTime = document.getElementById('tbl-received-time');

    const tblPool = document.getElementById('tbl-pool');
    const tblPoolTime = document.getElementById('tbl-pool-time');
    const tblUbi = document.getElementById('tbl-ubi');
    const tblUbiTime = document.getElementById('tbl-ubi-time');
    const tblSocial = document.getElementById('tbl-social');
    const tblSocialTime = document.getElementById('tbl-social-time');
    const tblGov = document.getElementById('tbl-gov');
    const tblGovTime = document.getElementById('tbl-gov-time');

    function formatTimeDuration(hours) {
        if (isNaN(hours) || hours <= 0) return '0.00 mins';
        const totalMinutes = hours * 60;
        if (totalMinutes < 60) {
            return `${totalMinutes.toFixed(2)} mins`;
        }
        const h = Math.floor(hours);
        const remainingMinutes = (hours - h) * 60;
        if (remainingMinutes < 0.01) {
            return `${h} hr${h > 1 ? 's' : ''}`;
        }
        return `${h} hr${h > 1 ? 's' : ''} ${remainingMinutes.toFixed(2)} mins`;
    }

    function calculatePerZero() {
        if (!inputBalA || !inputBalB) return;

        const rawBalA = parseFloat(inputBalA.value) || 0;
        const rawBalB = parseFloat(inputBalB.value) || 0;

        // Floor of 10 for log function resulting in log floor of 1.00
        const logA = Math.log10(Math.max(10, rawBalA));
        const logB = Math.log10(Math.max(10, rawBalB));

        if (contribA) contribA.textContent = `Fee contribution: ${logA.toFixed(2)}%`;
        if (contribB) contribB.textContent = `Fee contribution: ${logB.toFixed(2)}%`;

        // Average of log results with floor of 1.00% and no upper ceiling
        const avgFeePct = (logA + logB) / 2;
        if (resRate) resRate.textContent = `${avgFeePct.toFixed(2)}%`;

        // Time conversion and transaction fee calculations
        const convRate = parseFloat(inputConversionRate ? inputConversionRate.value : 20) || 20;
        const txAmount = parseFloat(inputTxAmount ? inputTxAmount.value : 50) || 0;

        const txHours = txAmount / convRate;
        if (txTimeEquiv) txTimeEquiv.textContent = formatTimeDuration(txHours);

        const feeAmount = txAmount * (avgFeePct / 100);
        const receivedAmount = txAmount - feeAmount;

        const feeHours = feeAmount / convRate;
        const receivedHours = receivedAmount / convRate;

        // Unified table population (only pure numbers under Deltars, and clean time under Your Time)
        if (tblPaid) tblPaid.textContent = txAmount.toFixed(3);
        if (tblPaidTime) tblPaidTime.textContent = formatTimeDuration(txHours);

        if (tblFee) tblFee.textContent = feeAmount.toFixed(3);
        if (tblFeeTime) tblFeeTime.textContent = formatTimeDuration(feeHours);

        if (tblReceived) tblReceived.textContent = receivedAmount.toFixed(3);
        if (tblReceivedTime) tblReceivedTime.textContent = formatTimeDuration(receivedHours);

        // Pool breakdown: 100% Pool, UBI (75%), Social (20%), Gov (5%)
        const ubiFee = feeAmount * 0.75;
        const socialFee = feeAmount * 0.20;
        const govFee = feeAmount * 0.05;

        if (tblPool) tblPool.textContent = feeAmount.toFixed(3);
        if (tblPoolTime) tblPoolTime.textContent = formatTimeDuration(feeHours);

        if (tblUbi) tblUbi.textContent = ubiFee.toFixed(3);
        if (tblUbiTime) tblUbiTime.textContent = formatTimeDuration(ubiFee / convRate);

        if (tblSocial) tblSocial.textContent = socialFee.toFixed(3);
        if (tblSocialTime) tblSocialTime.textContent = formatTimeDuration(socialFee / convRate);

        if (tblGov) tblGov.textContent = govFee.toFixed(3);
        if (tblGovTime) tblGovTime.textContent = formatTimeDuration(govFee / convRate);
    }

    // Bidirectional sync for Payor Balance input and slider
    if (inputBalA && sliderBalA) {
        inputBalA.addEventListener('input', () => {
            sliderBalA.value = inputBalA.value;
            calculatePerZero();
        });
        sliderBalA.addEventListener('input', () => {
            inputBalA.value = sliderBalA.value;
            calculatePerZero();
        });
    }

    // Bidirectional sync for Payee Balance input and slider
    if (inputBalB && sliderBalB) {
        inputBalB.addEventListener('input', () => {
            sliderBalB.value = inputBalB.value;
            calculatePerZero();
        });
        sliderBalB.addEventListener('input', () => {
            inputBalB.value = sliderBalB.value;
            calculatePerZero();
        });
    }

    if (inputConversionRate) {
        inputConversionRate.addEventListener('input', calculatePerZero);
    }
    if (inputTxAmount) {
        inputTxAmount.addEventListener('input', calculatePerZero);
    }

    calculatePerZero();

    // ----------------------------------------------------------------------
    // 3. Test Equilibrium Simulator (Sandbox)
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

        if (eqCommercialVol) eqCommercialVol.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(commercialVolumePerDay).toLocaleString()}/day`;
        if (eqPoolTotal) eqPoolTotal.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(dailyPoolContribution).toLocaleString()}/day`;
        if (eqDividendPerNode) eqDividendPerNode.innerHTML = `<span class="deltar-font">&#xE002;</span>${dividendPerNode.toFixed(3)}/day`;
    }

    if (sliderRatio) {
        [sliderRatio, sliderFriction, sliderNodes].forEach(el => {
            el.addEventListener('input', calculateEquilibrium);
        });
        calculateEquilibrium();
    }

    // ----------------------------------------------------------------------
    // 4. SCL Business Crowdfund Simulator
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
        if (sclDailyRate) sclDailyRate.innerHTML = `<span class="deltar-font">&#xE002;</span>${dailySCLPerPerson.toFixed(1)}/day`;
        if (valDonors) valDonors.textContent = `${donors} Donors`;

        const quarterLabels = ['Q0 (Initial Raised)', 'Q1 (3 Months Elapsed)', 'Q2 (6 Months Elapsed)', 'Q3 (9 Months Elapsed)', 'Q4 (12 Months - Expired)'];
        if (valQuarters) valQuarters.textContent = quarterLabels[quarters];

        const raisedPerPerson = dailySCLPerPerson * 1;
        const totalRaised = raisedPerPerson * donors * 100;
        const decayFactor = Math.max(0, 1 - (quarters * 0.25));
        const activeLimit = totalRaised * decayFactor;

        if (sclTotalRaised) sclTotalRaised.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(totalRaised).toLocaleString()}`;
        if (sclActiveLimit) sclActiveLimit.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(activeLimit).toLocaleString()}`;

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
