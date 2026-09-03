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
    // 2. Transaction Fee Calculator Helpers
    // ----------------------------------------------------------------------

    // Format numbers with comma separators for thousands, millions, etc.
    function formatNumberWithCommas(num, decimals = 3) {
        if (isNaN(num)) return '0.000';
        const fixedStr = Number(num).toFixed(decimals);
        const parts = fixedStr.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    // Smart Multi-Unit Time Formatter (max 2 units, leading with >= 1)
    function formatSmartDuration(hours) {
        if (isNaN(hours) || hours <= 0) return '0 secs';
        const totalSecs = hours * 3600;

        const SEC_PER_MIN = 60;
        const SEC_PER_HR = 3600;
        const SEC_PER_DAY = 86400;
        const SEC_PER_WEEK = 604800;
        const SEC_PER_MONTH = 2592000; // 30 days
        const SEC_PER_YEAR = 31536000; // 365 days

        if (totalSecs >= SEC_PER_YEAR) {
            const yrs = Math.floor(totalSecs / SEC_PER_YEAR);
            const remSecs = totalSecs % SEC_PER_YEAR;
            const mos = Math.round(remSecs / SEC_PER_MONTH);
            if (mos > 0 && mos < 12) return `${yrs.toLocaleString()} yr${yrs > 1 ? 's' : ''} ${mos} mo${mos > 1 ? 's' : ''}`;
            return `${yrs.toLocaleString()} yr${yrs > 1 ? 's' : ''}`;
        }
        if (totalSecs >= SEC_PER_MONTH) {
            const mos = Math.floor(totalSecs / SEC_PER_MONTH);
            const remSecs = totalSecs % SEC_PER_MONTH;
            const days = Math.round(remSecs / SEC_PER_DAY);
            if (days > 0 && days < 30) return `${mos} mo${mos > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
            return `${mos} mo${mos > 1 ? 's' : ''}`;
        }
        if (totalSecs >= SEC_PER_WEEK) {
            const wks = Math.floor(totalSecs / SEC_PER_WEEK);
            const remSecs = totalSecs % SEC_PER_WEEK;
            const days = Math.round(remSecs / SEC_PER_DAY);
            if (days > 0 && days < 7) return `${wks} wk${wks > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
            return `${wks} wk${wks > 1 ? 's' : ''}`;
        }
        if (totalSecs >= SEC_PER_DAY) {
            const days = Math.floor(totalSecs / SEC_PER_DAY);
            const remSecs = totalSecs % SEC_PER_DAY;
            const hrs = Math.round(remSecs / SEC_PER_HR);
            if (hrs > 0 && hrs < 24) return `${days} day${days > 1 ? 's' : ''} ${hrs} hr${hrs > 1 ? 's' : ''}`;
            return `${days} day${days > 1 ? 's' : ''}`;
        }
        if (totalSecs >= SEC_PER_HR) {
            const hrs = Math.floor(totalSecs / SEC_PER_HR);
            const remSecs = totalSecs % SEC_PER_HR;
            const mins = Math.round(remSecs / SEC_PER_MIN);
            if (mins > 0 && mins < 60) return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
            return `${hrs} hr${hrs > 1 ? 's' : ''}`;
        }
        if (totalSecs >= SEC_PER_MIN) {
            const mins = Math.floor(totalSecs / SEC_PER_MIN);
            const secs = Math.round(totalSecs % SEC_PER_MIN);
            if (secs > 0 && secs < 60) return `${mins} min${mins > 1 ? 's' : ''} ${secs} sec${secs > 1 ? 's' : ''}`;
            return `${mins} min${mins > 1 ? 's' : ''}`;
        }
        // Under 60 seconds
        if (totalSecs >= 1) {
            return `${totalSecs.toFixed(2)} secs`;
        }
        return `${totalSecs.toFixed(3)} secs`;
    }

    // Benchmark tier information based on 2,000 working hours / year
    function getSalaryTier(ratePerHour) {
        const annualWage = ratePerHour * 2000;
        const formattedAnnual = formatNumberWithCommas(annualWage, 0);

        if (ratePerHour < 0.5) {
            return { name: "Poorest Regions (Subsistence Level)", annual: formattedAnnual };
        } else if (ratePerHour < 5) {
            return { name: "Developing Nations Average", annual: formattedAnnual };
        } else if (ratePerHour < 25) {
            return { name: "Global Average / Median Income", annual: formattedAnnual };
        } else if (ratePerHour < 75) {
            return { name: "Developed Nations Average", annual: formattedAnnual };
        } else if (ratePerHour < 250) {
            return { name: "Developed Nations High Earner", annual: formattedAnnual };
        } else {
            return { name: "Developed Nations Wealthy / Top Tier", annual: formattedAnnual };
        }
    }

    // ----------------------------------------------------------------------
    // 3. Transaction Fee Calculator UI & Binding
    // ----------------------------------------------------------------------
    const inputBalA = document.getElementById('input-bal-a');
    const sliderBalA = document.getElementById('slider-bal-a');
    const inputBalB = document.getElementById('input-bal-b');
    const sliderBalB = document.getElementById('slider-bal-b');

    const contribA = document.getElementById('contrib-a');
    const contribB = document.getElementById('contrib-b');
    const resRate = document.getElementById('res-rate');

    const inputConversionRate = document.getElementById('input-conversion-rate');
    const sliderConversionRate = document.getElementById('slider-conversion-rate');
    const salaryTierInfo = document.getElementById('salary-tier-info');

    const inputTxAmount = document.getElementById('input-tx-amount');
    const sliderTxAmount = document.getElementById('slider-tx-amount');
    const txTimeEquiv = document.getElementById('tx-time-equiv');

    const resFeeAmount = document.getElementById('res-fee-amount');
    const resNetAmount = document.getElementById('res-net-amount');
    const resTimeCost = document.getElementById('res-time-cost');

    const poolUbi = document.getElementById('pool-ubi') || document.getElementById('pool-dividend');
    const poolUbiTime = document.getElementById('pool-ubi-time') || document.getElementById('pool-dividend-time');
    const poolSocial = document.getElementById('pool-social') || document.getElementById('pool-public');
    const poolSocialTime = document.getElementById('pool-social-time') || document.getElementById('pool-public-time');
    const poolGov = document.getElementById('pool-gov');
    const poolGovTime = document.getElementById('pool-gov-time');

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

    const MIN_LOG_RATE = Math.log10(0.041667); // -1.3802
    const MAX_LOG_RATE = Math.log10(10000);    // 4.0
    const LOG_SPAN = MAX_LOG_RATE - MIN_LOG_RATE;

    function rateToSliderPos(rate) {
        const clamped = Math.max(0.041667, Math.min(10000, rate));
        const frac = (Math.log10(clamped) - MIN_LOG_RATE) / LOG_SPAN;
        return Math.round(frac * 1000);
    }

    function sliderPosToRate(pos) {
        const frac = Math.max(0, Math.min(1000, pos)) / 1000;
        const logVal = MIN_LOG_RATE + frac * LOG_SPAN;
        const rawRate = Math.pow(10, logVal);
        if (rawRate >= 100) return Math.round(rawRate);
        if (rawRate >= 10) return parseFloat(rawRate.toFixed(1));
        if (rawRate >= 1) return parseFloat(rawRate.toFixed(2));
        return parseFloat(rawRate.toFixed(3));
    }

    function calculatePerZero() {
        if (!inputBalA || !inputBalB) return;

        const rawBalA = parseFloat(inputBalA.value);
        const rawBalB = parseFloat(inputBalB.value);

        const valBalA = isNaN(rawBalA) ? 0 : rawBalA;
        const valBalB = isNaN(rawBalB) ? 0 : rawBalB;

        // Floor of 10 for log function resulting in log floor of 1.00%
        const logA = Math.log10(Math.max(10, valBalA));
        const logB = Math.log10(Math.max(10, valBalB));

        if (contribA) contribA.textContent = `Fee contribution: ${logA.toFixed(2)}%`;
        if (contribB) contribB.textContent = `Fee contribution: ${logB.toFixed(2)}%`;

        // Average fee percentage with floor of 1.00%
        const avgFeePct = (logA + logB) / 2;
        if (resRate) resRate.textContent = `${avgFeePct.toFixed(2)}%`;

        // Conversion rate - strictly positive
        let convRate = parseFloat(inputConversionRate ? inputConversionRate.value : 20);
        if (isNaN(convRate) || convRate < 0.01) {
            convRate = 0.01;
            if (inputConversionRate) inputConversionRate.value = convRate;
        }

        // Update salary tier info
        const tier = getSalaryTier(convRate);
        if (salaryTierInfo) {
            salaryTierInfo.innerHTML = `<span class="tier-tag">Benchmark:</span> <strong id="tier-name">${tier.name}</strong> (~<span class="deltar-font">&#xE002;</span>${tier.annual}/yr)`;
        }

        // Transaction payment calculation
        const txAmount = Math.max(0, parseFloat(inputTxAmount ? inputTxAmount.value : 50) || 0);
        const txHours = convRate > 0 ? txAmount / convRate : 0;
        if (txTimeEquiv) txTimeEquiv.textContent = formatSmartDuration(txHours);

        const feeAmount = txAmount * (avgFeePct / 100);
        const receivedAmount = Math.max(0, txAmount - feeAmount);

        const feeHours = convRate > 0 ? feeAmount / convRate : 0;
        const receivedHours = convRate > 0 ? receivedAmount / convRate : 0;

        // Primary Breakdown Result Items
        if (resFeeAmount) resFeeAmount.innerHTML = `<span class="deltar-font">&#xE002;</span>${formatNumberWithCommas(feeAmount, 2)}`;
        if (resNetAmount) resNetAmount.innerHTML = `<span class="deltar-font">&#xE002;</span>${formatNumberWithCommas(receivedAmount, 2)}`;
        if (resTimeCost) resTimeCost.textContent = formatSmartDuration(feeHours);

        // Transaction settlement row displays with comma separators (backward compatibility)
        if (tblPaid) tblPaid.textContent = formatNumberWithCommas(txAmount, 3);
        if (tblPaidTime) tblPaidTime.textContent = formatSmartDuration(txHours);

        if (tblFee) tblFee.textContent = formatNumberWithCommas(feeAmount, 3);
        if (tblFeeTime) tblFeeTime.textContent = formatSmartDuration(feeHours);

        if (tblReceived) tblReceived.textContent = formatNumberWithCommas(receivedAmount, 3);
        if (tblReceivedTime) tblReceivedTime.textContent = formatSmartDuration(receivedHours);

        // Pool breakdown: Living Dividend (UBI - 75%), Public Goods (20%), Gov Contribution (5%)
        const ubiFee = feeAmount * 0.75;
        const publicGoodsFee = feeAmount * 0.20;
        const govFee = feeAmount * 0.05;

        if (tblPool) tblPool.textContent = formatNumberWithCommas(feeAmount, 3);
        if (tblPoolTime) tblPoolTime.textContent = formatSmartDuration(feeHours);

        if (tblUbi) tblUbi.textContent = formatNumberWithCommas(ubiFee, 3);
        if (tblUbiTime) tblUbiTime.textContent = formatSmartDuration(ubiFee / convRate);

        if (tblSocial) tblSocial.textContent = formatNumberWithCommas(publicGoodsFee, 3);
        if (tblSocialTime) tblSocialTime.textContent = formatSmartDuration(publicGoodsFee / convRate);

        // Deep Dive Pool Cards
        if (poolUbi) poolUbi.innerHTML = `<span class="deltar-font">&#xE002;</span>${formatNumberWithCommas(ubiFee, 3)}`;
        if (poolUbiTime) poolUbiTime.textContent = `${formatSmartDuration(ubiFee / convRate)} of work`;

        if (poolSocial) poolSocial.innerHTML = `<span class="deltar-font">&#xE002;</span>${formatNumberWithCommas(publicGoodsFee, 3)}`;
        if (poolSocialTime) poolSocialTime.textContent = `${formatSmartDuration(publicGoodsFee / convRate)} of work`;

        if (poolGov) poolGov.innerHTML = `<span class="deltar-font">&#xE002;</span>${formatNumberWithCommas(govFee, 3)}`;
        if (poolGovTime) poolGovTime.textContent = `${formatSmartDuration(govFee / convRate)} of work`;
    }
    window.calculatePerZero = calculatePerZero;

    // Bidirectional sync for Payor Account's Balance
    if (inputBalA && sliderBalA) {
        ['input', 'change'].forEach(evt => {
            inputBalA.addEventListener(evt, () => {
                sliderBalA.value = inputBalA.value;
                calculatePerZero();
            });
            sliderBalA.addEventListener(evt, () => {
                inputBalA.value = sliderBalA.value;
                calculatePerZero();
            });
        });
    }

    // Bidirectional sync for Payee Account's Balance
    if (inputBalB && sliderBalB) {
        ['input', 'change'].forEach(evt => {
            inputBalB.addEventListener(evt, () => {
                sliderBalB.value = inputBalB.value;
                calculatePerZero();
            });
            sliderBalB.addEventListener(evt, () => {
                inputBalB.value = sliderBalB.value;
                calculatePerZero();
            });
        });
    }

    // Bidirectional sync for Conversion Rate & Slider
    if (inputConversionRate && sliderConversionRate) {
        ['input', 'change'].forEach(evt => {
            inputConversionRate.addEventListener(evt, () => {
                let val = parseFloat(inputConversionRate.value);
                if (val < 0.01) {
                    val = 0.01;
                    inputConversionRate.value = val;
                }
                sliderConversionRate.value = rateToSliderPos(val);
                calculatePerZero();
            });
            sliderConversionRate.addEventListener(evt, () => {
                const calculatedRate = sliderPosToRate(parseInt(sliderConversionRate.value, 10));
                inputConversionRate.value = calculatedRate;
                calculatePerZero();
            });
        });
    }

    // Bidirectional sync for Transaction Size
    if (inputTxAmount && sliderTxAmount) {
        ['input', 'change'].forEach(evt => {
            inputTxAmount.addEventListener(evt, () => {
                let val = parseFloat(inputTxAmount.value);
                if (isNaN(val) || val < 0) val = 0;
                sliderTxAmount.value = val;
                calculatePerZero();
            });
            sliderTxAmount.addEventListener(evt, () => {
                inputTxAmount.value = sliderTxAmount.value;
                calculatePerZero();
            });
        });
    } else if (inputTxAmount) {
        ['input', 'change'].forEach(evt => {
            inputTxAmount.addEventListener(evt, () => {
                if (parseFloat(inputTxAmount.value) < 0) inputTxAmount.value = 0;
                calculatePerZero();
            });
        });
    }

    calculatePerZero();

    // ----------------------------------------------------------------------
    // 4. Personal & Enterprise Credit Simulator (PCL + Anti-Whale SCL Crowdfund)
    // ----------------------------------------------------------------------
    const btnPresetEarly = document.getElementById('btn-preset-early');
    const btnPresetMid = document.getElementById('btn-preset-mid');
    const btnPresetMature = document.getElementById('btn-preset-mature');

    // Tier 1 DOM Elements
    const sliderBaseCL = document.getElementById('slider-basecl');
    const valBaseCL = document.getElementById('val-basecl');
    const descBaseCL = document.getElementById('desc-basecl');
    const descBaseCLMain = document.getElementById('desc-basecl-main');
    const descBaseCLDesc = document.getElementById('desc-basecl-desc');

    const sliderSpend = document.getElementById('slider-spend');
    const valSpend = document.getElementById('val-spend');
    const descSpend = document.getElementById('desc-spend');
    const descSpendMain = document.getElementById('desc-spend-main');
    const descSpendDesc = document.getElementById('desc-spend-desc');

    const sliderTrend = document.getElementById('slider-trend');
    const valTrend = document.getElementById('val-trend');
    const descTrend = document.getElementById('desc-trend');
    const descTrendMain = document.getElementById('desc-trend-main');
    const descTrendDesc = document.getElementById('desc-trend-desc');

    const sliderActivity = document.getElementById('slider-activity');
    const valActivity = document.getElementById('val-activity');
    const descActivity = document.getElementById('desc-activity');
    const descActivityMain = document.getElementById('desc-activity-main');
    const descActivityDesc = document.getElementById('desc-activity-desc');

    const sliderUnusedSCL = document.getElementById('slider-unused-scl');
    const valUnusedSCL = document.getElementById('val-unused-scl');
    const descUnusedSCL = document.getElementById('desc-unused-scl');
    const descUnusedSCLMain = document.getElementById('desc-unused-scl-main');
    const descUnusedSCLDesc = document.getElementById('desc-unused-scl-desc');

    const outPCL = document.getElementById('out-pcl');
    const outPCLFormula = document.getElementById('out-pcl-formula');
    const outSCLRate = document.getElementById('out-scl-rate');
    const outAvailSCL = document.getElementById('out-avail-scl');

    // Tier 2 DOM Elements
    const sliderBackers = document.getElementById('slider-backers');
    const valBackers = document.getElementById('val-backers');
    const descBackers = document.getElementById('desc-backers');
    const descBackersMain = document.getElementById('desc-backers-main');
    const descBackersDesc = document.getElementById('desc-backers-desc');

    const sliderDmin = document.getElementById('slider-dmin');
    const valDmin = document.getElementById('val-dmin');
    const descDmin = document.getElementById('desc-dmin');
    const descDminMain = document.getElementById('desc-dmin-main');
    const descDminDesc = document.getElementById('desc-dmin-desc');

    const sliderDmax = document.getElementById('slider-dmax');
    const valDmax = document.getElementById('val-dmax');
    const descDmax = document.getElementById('desc-dmax');
    const descDmaxMain = document.getElementById('desc-dmax-main');
    const descDmaxDesc = document.getElementById('desc-dmax-desc');

    const outBizCredit = document.getElementById('out-biz-credit');
    const outConsensusStatus = document.getElementById('out-consensus-status');

    // 24-Month Canvas
    const creditRunwayCanvas = document.getElementById('credit-runway-canvas');

    function drawCreditRunwayChart(initialCredit) {
        if (!creditRunwayCanvas) return;
        const ctx = creditRunwayCanvas.getContext('2d');
        const rect = creditRunwayCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Resize canvas for sharp rendering
        creditRunwayCanvas.width = rect.width * dpr;
        creditRunwayCanvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;

        ctx.clearRect(0, 0, w, h);

        const padLeft = 74;
        const padRight = 32;
        const padTop = 22;
        const padBottom = 38;

        const graphW = w - padLeft - padRight;
        const graphH = h - padTop - padBottom;

        // 6 vertical grid boxes of resolution in height:
        // Peak is Month 6 = 1.25 * initialCredit (5 boxes)
        // 1st quarter is Month 0-3 = 1.00 * initialCredit (4 boxes)
        // 5 / 4 = 1.25 -> exactly 25% taller!
        // 6 boxes total = 1.50 * initialCredit (maxCap)
        const ySteps = 6;
        const stepVal = initialCredit / 4;
        const maxCap = Math.max(600, stepVal * ySteps);

        // 9 Checkpoints: Month 0 through Month 24
        // Initial fundraise = 125k (1.00)
        // M0-M3: 125k (1.00)
        // M3-M6: falls 25% (31.25k) -> 93.75k (0.75)
        // M6-M9: falls 25% (31.25k) to 62.5k, plus +125k renewal -> 187.5k (1.50)
        // M9-M12: both fall by 31.25k each (-62.5k) -> 125k (1.00)
        // M12-M15: double fall repeats (-62.5k) -> 62.5k (0.50)
        // M15-M18: falls 31.25k -> 31.25k (0.25)
        // M18-M24: falls 31.25k -> 0.00
        const quarters = [
            { m: 0, label: 'Month 0', decay: 1.00 },
            { m: 3, label: 'Month 3', decay: 0.75 },
            { m: 6, label: 'Month 6', decay: 1.50 },   // 6-Month Renewal Boost (Remaining 0.50 + New 1.00 = 1.50)
            { m: 9, label: 'Month 9', decay: 1.00 },   // Double-fall -0.50 (Remaining 0.25 + 0.75 = 1.00)
            { m: 12, label: 'Month 12', decay: 0.50 }, // Batch 1 completes, Batch 2 at 50% = 0.50
            { m: 15, label: 'Month 15', decay: 0.25 }, // Batch 2 at 25% = 0.25
            { m: 18, label: 'Month 18', decay: 0.00 }, // Batch 2 expires (Zero Mark)
            { m: 21, label: 'Month 21', decay: 0.00 },
            { m: 24, label: 'Month 24', decay: 0.00 }
        ];

        // Format chart Y-axis numbers cleanly with round units
        function formatChartYAxisVal(val) {
            if (val === 0) return '0';
            if (val >= 1000000) {
                const mVal = val / 1000000;
                return mVal % 1 === 0 ? mVal.toFixed(0) + 'M' : mVal.toFixed(2) + 'M';
            }
            if (val >= 1000) {
                const kVal = val / 1000;
                return kVal % 1 === 0 ? kVal.toFixed(0) + 'k' : (kVal * 10 % 1 === 0 ? kVal.toFixed(1) + 'k' : kVal.toFixed(2) + 'k');
            }
            return Math.round(val).toLocaleString();
        }

        // Draw horizontal grid lines & Y-axis labels with custom Deltar font
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'right';

        for (let i = 0; i <= ySteps; i++) {
            const val = stepVal * i;
            const y = padTop + graphH - (i / ySteps) * graphH;

            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(w - padRight, y);
            ctx.stroke();

            const valStr = formatChartYAxisVal(val);
            ctx.font = '10.5px DeltarFont, "JetBrains Mono", monospace';
            ctx.fillText('\uE002 ' + valStr, padLeft - 8, y + 3.5);
        }

        // Draw X-axis grid lines & Month labels
        ctx.textAlign = 'center';
        const fontSize = w < 540 ? '8.5px' : '9.5px';
        ctx.font = `${fontSize} "JetBrains Mono", monospace`;

        quarters.forEach((q, i) => {
            const x = padLeft + (i / (quarters.length - 1)) * graphW;
            ctx.beginPath();
            ctx.moveTo(x, padTop);
            ctx.lineTo(x, padTop + graphH);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.stroke();

            ctx.fillStyle = (q.m === 0 || q.m === 6 || q.m === 18) ? '#00f3ff' : '#64748b';
            ctx.fillText(q.label, x, h - 12);
        });

        // 1. Draw Stepped Cyan Curve (Credit Ceiling)
        ctx.beginPath();
        quarters.forEach((q, i) => {
            const x = padLeft + (i / (quarters.length - 1)) * graphW;
            const y = padTop + graphH - ((initialCredit * q.decay) / maxCap) * graphH;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                // Stepped horizontal then drop or jump to current level
                ctx.lineTo(x, padTop + graphH - ((initialCredit * quarters[i - 1].decay) / maxCap) * graphH);
                ctx.lineTo(x, y);
            }
        });

        // Stroke Stepped Ceiling
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(0, 243, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Fill area beneath Stepped Ceiling
        ctx.lineTo(padLeft + graphW, padTop + graphH);
        ctx.lineTo(padLeft, padTop + graphH);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.fill();

        // 2. Draw Enterprise Overdraft Utilization Curve (Wavy / Spiky line tracking below stepped line)
        ctx.beginPath();
        const curvePoints = [];
        const subSteps = 80; // Smooth interpolation across 24 months
        for (let s = 0; s <= subSteps; s++) {
            const monthFrac = (s / subSteps) * 24;
            const x = padLeft + (monthFrac / 24) * graphW;

            // Determine active ceiling at this month
            let activeCeiling = 0;
            if (monthFrac < 3) activeCeiling = initialCredit * 1.00;
            else if (monthFrac < 6) activeCeiling = initialCredit * 0.75;
            else if (monthFrac < 9) activeCeiling = initialCredit * 1.50; // 6-Mo Renewal Boost to 187.5k
            else if (monthFrac < 12) activeCeiling = initialCredit * 1.00;
            else if (monthFrac < 15) activeCeiling = initialCredit * 0.50;
            else if (monthFrac < 18) activeCeiling = initialCredit * 0.25;
            else activeCeiling = 0; // Expired at Month 18

            // Wavy / spiky utilization that follows but remains comfortably below the stepped line
            let actualUtilization = 0;
            if (monthFrac < 18) {
                const baseWave = 0.58 + 0.14 * Math.sin(monthFrac * 1.7) + 0.08 * Math.cos(monthFrac * 3.6);
                const spikeNoise = 0.07 * Math.sin(monthFrac * 8.4 + 1.2);
                const utilRatio = Math.max(0.32, Math.min(0.82, baseWave + spikeNoise));
                const rampFactor = monthFrac >= 16 ? Math.max(0, (18 - monthFrac) / 2) : 1;
                actualUtilization = activeCeiling * utilRatio * rampFactor;
            }

            const y = padTop + graphH - (actualUtilization / maxCap) * graphH;
            curvePoints.push({ x, y });
        }

        ctx.beginPath();
        curvePoints.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function updateFloatingPosition(sliderEl, floatingEl, minVal, maxVal, currentVal) {
        if (!sliderEl || !floatingEl) return;
        const clampedVal = Math.max(minVal, Math.min(maxVal, currentVal));
        const span = maxVal - minVal;
        const pct = span <= 0 ? 0 : Math.max(0, Math.min(100, ((clampedVal - minVal) / span) * 100));
        // Mathematically guarantee that floating text stays 100% within the container bounds
        floatingEl.style.left = `${pct}%`;
        floatingEl.style.transform = `translateX(-${pct}%)`;
    }

    function calculateCreditEngine() {
        if (!sliderBaseCL || !sliderSpend || !sliderTrend || !sliderActivity || !sliderUnusedSCL) return;

        const baseCL = parseFloat(sliderBaseCL.value) || 2000;
        const nationalSpend = parseFloat(sliderSpend.value) || 5;
        const rawTrend = parseFloat(sliderTrend.value) !== undefined ? parseFloat(sliderTrend.value) : 2.0;
        const activity = parseFloat(sliderActivity.value) || 2.0;

        // 1. Regional Modifier R ($2 = 0.2x, $5 = 1.0x, $10 = 2.0x)
        let R = 1.0;
        if (nationalSpend <= 2) {
            R = 0.2;
        } else if (nationalSpend <= 5) {
            R = 0.2 + (nationalSpend - 2) * (0.8 / 3);
        } else {
            R = 1.0 + (nationalSpend - 5) * (1.0 / 5);
        }
        R = Math.min(2.0, Math.max(0.2, R));

        // 2. Trend Multiplier (1.0x for <= 1.00, up to 100.0x for >= 100.00)
        let trendMultiplier = 1.0;
        if (rawTrend <= 1.0) {
            trendMultiplier = 1.0;
        } else if (rawTrend >= 100.0) {
            trendMultiplier = 100.0;
        } else {
            trendMultiplier = rawTrend;
        }

        // 3. Personal Credit Limit (PCL) Calculation
        // Formula: PCL = BaseCL * (1 + Regional_COL + Transaction_Count + Balance_Trend)
        const PCL = baseCL * (1 + R + activity + trendMultiplier);
        const dailySCLRate = PCL / 365;

        // Dynamic max on Accumulated Unused SCL Balance (double the PCL currently shown)
        const maxUnusedSCL = Math.max(1000, Math.round(2 * PCL));
        sliderUnusedSCL.max = maxUnusedSCL;
        if (parseFloat(sliderUnusedSCL.value) > maxUnusedSCL) {
            sliderUnusedSCL.value = maxUnusedSCL;
        }
        const unusedSCL = parseFloat(sliderUnusedSCL.value);

        // Update Tier 1 Badges & Floating Tiers
        if (valBaseCL) valBaseCL.innerHTML = `<span class="deltar-font">&#xE002;</span>${baseCL.toLocaleString()}`;
        if (descBaseCLMain && descBaseCLDesc) {
            if (baseCL === 2000) {
                descBaseCLMain.innerHTML = `<span class="deltar-font">&#xE002;</span> 2,000`;
                descBaseCLDesc.textContent = '(Low Inequality System Minimum Floor)';
            } else if (baseCL <= 10000) {
                descBaseCLMain.textContent = 'Moderate Regional Inequality';
                descBaseCLDesc.textContent = '(Standard Base Floor)';
            } else if (baseCL <= 30000) {
                descBaseCLMain.textContent = 'High Wealth Concentration';
                descBaseCLDesc.textContent = '(Expanded Base Floor)';
            } else {
                descBaseCLMain.textContent = 'Severe Inequality';
                descBaseCLDesc.textContent = '(Maximum Counterweight)';
            }
        }
        updateFloatingPosition(sliderBaseCL, descBaseCL, 2000, 50000, baseCL);

        // Regional spend: display formatted multiplier "1.00x", "1.60x" etc.
        if (valSpend) valSpend.textContent = `${R.toFixed(2)}x`;
        if (descSpendMain && descSpendDesc) {
            descSpendMain.innerHTML = `<span class="deltar-font">&#xE002;</span> ${nationalSpend}`;
            if (nationalSpend <= 2) {
                descSpendDesc.textContent = '(Subsistence / Lowest Cost Region)';
            } else if (nationalSpend < 5) {
                descSpendDesc.textContent = '(Low Cost-of-Living Region)';
            } else if (nationalSpend === 5) {
                descSpendDesc.textContent = '(Global Baseline Average)';
            } else if (nationalSpend < 10) {
                descSpendDesc.textContent = '(Developing to High-Cost Standard)';
            } else {
                descSpendDesc.textContent = '(High Cost-of-Living Metro Area — Max Cap)';
            }
        }
        updateFloatingPosition(sliderSpend, descSpend, 2, 10, nationalSpend);

        // Balance Trend display & floating subtext (range: -10 to 120, multiplier: 1.0x to 100.0x)
        if (valTrend) valTrend.textContent = `${trendMultiplier.toFixed(1)}x`;
        if (descTrendMain && descTrendDesc) {
            const formattedRawTrend = rawTrend % 1 === 0 ? rawTrend.toFixed(0) : rawTrend.toFixed(1);
            descTrendMain.innerHTML = `<span class="deltar-font">&#xE002;</span> ${formattedRawTrend}`;
            if (rawTrend <= 1.0) {
                descTrendDesc.textContent = '(1.0x Baseline Floor)';
            } else if (rawTrend <= 5.0) {
                descTrendDesc.textContent = '(Consistent Earning & Savings)';
            } else if (rawTrend <= 20.0) {
                descTrendDesc.textContent = '(Active Credit Building)';
            } else if (rawTrend <= 100.0) {
                descTrendDesc.textContent = '(Motivated Savings & Elite Capital)';
            } else {
                descTrendDesc.textContent = '(100.0x Maximum Multiplier Cap)';
            }
        }
        updateFloatingPosition(sliderTrend, descTrend, -10.0, 120.0, rawTrend);

        if (valActivity) valActivity.textContent = `${activity.toFixed(1)}x`;
        if (descActivityMain && descActivityDesc) {
            if (activity === 1.0) {
                descActivityMain.textContent = 'Low Activity';
                descActivityDesc.textContent = '(< 2 transactions/day)';
            } else if (activity <= 1.5) {
                descActivityMain.textContent = 'Moderate Trade Velocity';
                descActivityDesc.textContent = '(3–5 transactions/day)';
            } else {
                descActivityMain.textContent = 'High Daily Circulation';
                descActivityDesc.textContent = '(6+ transactions/day — 2.0x Max)';
            }
        }
        updateFloatingPosition(sliderActivity, descActivity, 1.0, 2.0, activity);

        if (valUnusedSCL) valUnusedSCL.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(unusedSCL).toLocaleString()}`;
        if (descUnusedSCLMain && descUnusedSCLDesc) {
            if (unusedSCL <= 0.2 * maxUnusedSCL) {
                descUnusedSCLMain.textContent = 'New Account / Minimal Unused';
                descUnusedSCLDesc.textContent = '(Building Reserve)';
            } else if (unusedSCL <= 0.5 * maxUnusedSCL) {
                descUnusedSCLMain.textContent = 'Standard Unspent Balance';
                descUnusedSCLDesc.textContent = '(Active Reserve)';
            } else if (unusedSCL <= 0.8 * maxUnusedSCL) {
                descUnusedSCLMain.textContent = 'High Accumulated Reserve';
                descUnusedSCLDesc.textContent = '(Substantial Capacity)';
            } else {
                descUnusedSCLMain.textContent = 'Maximum Reserve (2x PCL)';
                descUnusedSCLDesc.textContent = '(Subject to 2-Year Expiration)';
            }
        }
        updateFloatingPosition(sliderUnusedSCL, descUnusedSCL, 0, maxUnusedSCL, unusedSCL);

        // Tier 1 Summary Cards & Active PCL Formula (Concise, no leading prefix)
        if (outPCL) outPCL.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(PCL).toLocaleString()}`;
        if (outPCLFormula) {
            outPCLFormula.textContent = `${Math.round(baseCL).toLocaleString()} × (1 + ${R.toFixed(1)} + ${activity.toFixed(1)} + ${trendMultiplier.toFixed(1)})`;
        }
        if (outSCLRate) outSCLRate.innerHTML = `<span class="deltar-font">&#xE002;</span>${dailySCLRate.toFixed(1)}/day`;
        if (outAvailSCL) outAvailSCL.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(unusedSCL).toLocaleString()}`;

        // 3. Tier 2: Enterprise Crowdfunding (Anti-Whale Enforcement)
        if (sliderBackers && sliderDmin && sliderDmax) {
            const backers = parseInt(sliderBackers.value, 10) || 25;
            const dMin = parseFloat(sliderDmin.value) || 2000;

            // Enforce Anti-Whale Rule: D_max is hard-capped at 4 * D_min
            sliderDmax.min = dMin;
            sliderDmax.max = 4 * dMin;
            if (parseFloat(sliderDmax.value) > 4 * dMin) sliderDmax.value = 4 * dMin;
            if (parseFloat(sliderDmax.value) < dMin) sliderDmax.value = dMin;

            const dMax = parseFloat(sliderDmax.value);

            if (valBackers) valBackers.textContent = `${backers} Backers`;
            if (descBackersMain && descBackersDesc) {
                descBackersMain.textContent = `${backers} Backers`;
                if (backers === 25) descBackersDesc.textContent = '(Minimum Required Group Size)';
                else if (backers < 100) descBackersDesc.textContent = '(Local Community Project Scale)';
                else if (backers < 300) descBackersDesc.textContent = '(Regional Enterprise Scale)';
                else descBackersDesc.textContent = '(Major Infrastructure Enterprise Scale)';
            }
            updateFloatingPosition(sliderBackers, descBackers, 25, 500, backers);

            if (valDmin) valDmin.innerHTML = `<span class="deltar-font">&#xE002;</span>${dMin.toLocaleString()}`;
            if (descDminMain && descDminDesc) {
                descDminMain.innerHTML = `<span class="deltar-font">&#xE002;</span> ${dMin.toLocaleString()}`;
                if (dMin <= 2000) descDminDesc.textContent = '(Micro Supporter Base)';
                else if (dMin <= 10000) descDminDesc.textContent = '(Standard Member Contribution)';
                else descDminDesc.textContent = '(High-Capacity Supporter Base)';
            }
            updateFloatingPosition(sliderDmin, descDmin, 500, 20000, dMin);

            const spreadRatio = (dMax / dMin).toFixed(1);
            if (valDmax) valDmax.innerHTML = `<span class="deltar-font">&#xE002;</span>${dMax.toLocaleString()}`;
            if (descDmaxMain && descDmaxDesc) {
                descDmaxMain.textContent = `${spreadRatio}x Spread`;
                if (dMax === dMin) descDmaxDesc.textContent = '(Equal Gifts across all donors)';
                else if (dMax === 4 * dMin) descDmaxDesc.textContent = '(Anti-Whale Rule Limit)';
                else descDmaxDesc.textContent = '(Valid Tiered Gift Spread)';
            }
            updateFloatingPosition(sliderDmax, descDmax, sliderDmax.min, sliderDmax.max, dMax);

            const dAvg = (dMin + dMax) / 2;
            const initialBusinessCredit = backers * dAvg;

            if (outBizCredit) outBizCredit.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(initialBusinessCredit).toLocaleString()}`;
            if (outConsensusStatus) {
                outConsensusStatus.innerHTML = `${backers} Backers × Avg <span class="deltar-font">&#xE002;</span>${Math.round(dAvg).toLocaleString()} = <span class="deltar-font">&#xE002;</span>${Math.round(initialBusinessCredit).toLocaleString()}`;
            }

            // Draw 24-Month Runway Chart
            drawCreditRunwayChart(initialBusinessCredit);
        }
    }
    window.calculateCreditEngine = calculateCreditEngine;

    // Attach event listeners to all Tier 1 & Tier 2 sliders
    [sliderBaseCL, sliderSpend, sliderTrend, sliderActivity, sliderUnusedSCL, sliderBackers, sliderDmin, sliderDmax].forEach(el => {
        if (el) {
            ['input', 'change'].forEach(evt => {
                el.addEventListener(evt, calculateCreditEngine);
            });
        }
    });

    // Preset Buttons Logic
    function applyPreset(stage) {
        if (stage === 'early') {
            if (sliderBaseCL) sliderBaseCL.value = 2000;
            if (sliderSpend) sliderSpend.value = 5;
            if (sliderTrend) sliderTrend.value = 2.0;
            if (sliderActivity) sliderActivity.value = 2.0;
            if (sliderBackers) sliderBackers.value = 25;
            if (sliderDmin) sliderDmin.value = 2000;
            if (sliderDmax) {
                sliderDmax.max = 8000;
                sliderDmax.value = 8000;
            }
            // PCL = 10,000 -> max unused SCL = 20,000
            if (sliderUnusedSCL) {
                sliderUnusedSCL.max = 20000;
                sliderUnusedSCL.value = 10000;
            }
        } else if (stage === 'mid') {
            if (sliderBaseCL) sliderBaseCL.value = 4000;
            if (sliderSpend) sliderSpend.value = 5;
            if (sliderTrend) sliderTrend.value = 25.0;
            if (sliderActivity) sliderActivity.value = 2.0;
            if (sliderBackers) sliderBackers.value = 50;
            if (sliderDmin) sliderDmin.value = 4000;
            if (sliderDmax) {
                sliderDmax.max = 16000;
                sliderDmax.value = 16000;
            }
            // PCL = (4000*1) + (4000*25*2) = 4000 + 200000 = 204,000 -> max unused SCL = 408,000
            if (sliderUnusedSCL) {
                sliderUnusedSCL.max = 408000;
                sliderUnusedSCL.value = 100000;
            }
        } else if (stage === 'mature') {
            if (sliderBaseCL) sliderBaseCL.value = 10000;
            if (sliderSpend) sliderSpend.value = 5;
            if (sliderTrend) sliderTrend.value = 30.0;
            if (sliderActivity) sliderActivity.value = 2.0;
            if (sliderBackers) sliderBackers.value = 500;
            if (sliderDmin) sliderDmin.value = 20000;
            if (sliderDmax) {
                sliderDmax.max = 80000;
                sliderDmax.value = 80000;
            }
            // PCL = (10000*1) + (10000*30*2) = 10000 + 600000 = 610,000 -> max unused SCL = 1,220,000
            if (sliderUnusedSCL) {
                sliderUnusedSCL.max = 1220000;
                sliderUnusedSCL.value = 500000;
            }
        }

        [btnPresetEarly, btnPresetMid, btnPresetMature].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (stage === 'early' && btnPresetEarly) btnPresetEarly.classList.add('active');
        if (stage === 'mid' && btnPresetMid) btnPresetMid.classList.add('active');
        if (stage === 'mature' && btnPresetMature) btnPresetMature.classList.add('active');

        // Programmatically dispatch 'input' events to update all readouts, labels, and charts
        [sliderBaseCL, sliderSpend, sliderTrend, sliderActivity, sliderBackers, sliderDmin, sliderDmax, sliderUnusedSCL].forEach(slider => {
            if (slider) slider.dispatchEvent(new Event('input'));
        });
    }

    if (btnPresetEarly) btnPresetEarly.addEventListener('click', () => applyPreset('early'));
    if (btnPresetMid) btnPresetMid.addEventListener('click', () => applyPreset('mid'));
    if (btnPresetMature) btnPresetMature.addEventListener('click', () => applyPreset('mature'));

    calculateCreditEngine();
    window.addEventListener('resize', () => {
        if (sliderBackers && sliderDmin && sliderDmax) {
            const backers = parseInt(sliderBackers.value, 10) || 25;
            const dMin = parseFloat(sliderDmin.value) || 2000;
            const dMax = parseFloat(sliderDmax.value) || 8000;
            drawCreditRunwayChart(backers * ((dMin + dMax) / 2));
        }
    });

    // ----------------------------------------------------------------------
    // 5. Macroeconomic Simulator & Dividend Engine (Spec Revision V3 + Option C)
    // ----------------------------------------------------------------------
    const sliderLivingCost = document.getElementById('slider-living-cost');
    const sliderSupplyChain = document.getElementById('slider-supply-chain');
    const sliderVelocity = document.getElementById('slider-velocity');

    const valLivingCost = document.getElementById('val-living-cost');
    const valSupplyChain = document.getElementById('val-supply-chain');
    const valVelocity = document.getElementById('val-velocity');
    const btnSolveCoverage = document.getElementById('btn-solve-coverage');

    // Floating Tier Benchmark Text Elements
    const tierLivingCost = document.getElementById('tier-living-cost');
    const tierLivingCostName = document.getElementById('tier-living-cost-name');
    const tierLivingCostDesc = document.getElementById('tier-living-cost-desc');

    const tierSupplyChain = document.getElementById('tier-supply-chain');
    const tierSupplyChainName = document.getElementById('tier-supply-chain-name');
    const tierSupplyChainDesc = document.getElementById('tier-supply-chain-desc');

    const tierVelocity = document.getElementById('tier-velocity');
    const tierVelocityName = document.getElementById('tier-velocity-name');
    const tierVelocityDesc = document.getElementById('tier-velocity-desc');

    // Left Card (Status Quo) Metric Elements
    const legacyDailyCostEl = document.getElementById('legacy-daily-cost');
    const legacyColSubtext = document.getElementById('legacy-col-subtext');
    const legacyNetPayoutEl = document.getElementById('legacy-net-payout');
    const legacyMoneySupplyEl = document.getElementById('legacy-money-supply');
    const legacyInterestCostEl = document.getElementById('legacy-interest-cost');
    const legacyCoverageText = document.getElementById('legacy-coverage-text');
    const legacyProgressFill = document.getElementById('legacy-progress-fill');

    // Right Card (IOUBI) Metric Elements
    const ioubiDailyCostEl = document.getElementById('ioubi-daily-cost');
    const ioubiDailyUbiEl = document.getElementById('ioubi-daily-ubi');
    const ioubiMoneySupplyEl = document.getElementById('ioubi-money-supply');
    const ioubiInterestCostEl = document.getElementById('ioubi-interest-cost');
    const ioubiCoverageText = document.getElementById('ioubi-coverage-text');
    const ioubiProgressFill = document.getElementById('ioubi-progress-fill');

    const ioubiPoolUbi = document.getElementById('ioubi-pool-ubi');
    const ioubiPoolSocial = document.getElementById('ioubi-pool-social');
    const ioubiPoolGov = document.getElementById('ioubi-pool-gov');
    const ioubiOutcomeBanner = document.getElementById('ioubi-outcome-banner');

    function getLivingCostTier(cost) {
        if (cost < 18000) return { name: "Basic Survival Floor", desc: "(Minimal Nutrition & Shelter)" };
        if (cost < 30000) return { name: "Median Developed Living", desc: "(Essential Stability & Healthcare)" };
        if (cost < 40000) return { name: "Comfortable Standard", desc: "(Full Mobility & Abundance)" };
        return { name: "High Comfort Standard", desc: "(Premium Quality of Life)" };
    }

    function getSupplyChainTier(multiplier) {
        if (multiplier < 15) return { name: "Direct Local Economy", desc: "(Farmer-to-Consumer & Micro-trade)" };
        if (multiplier < 40) return { name: "Regional Light Industry", desc: "(Local Processing & Wholesaling)" };
        if (multiplier < 80) return { name: "Deep Modern Supply Chain", desc: "(Global Multi-Tier Distribution, 70:1)" };
        return { name: "Advanced Fabrication Network", desc: "(Complex High-Tech Multi-Tier Mesh)" };
    }

    function getVelocityTier(velocity) {
        if (velocity < 0.05) return { name: "Today's Debt Economy", desc: "(Stagnant Central Bank Velocity, 1.2 turns/yr)" };
        if (velocity < 0.5) return { name: "Transition Velocity", desc: "(Accelerated Trade Circulation)" };
        if (velocity < 2.0) return { name: "IOUBI Full Equilibrium", desc: "(Healthy Daily JIT Clearing)" };
        return { name: "High-Throughput Digital Commercial Mesh", desc: "(Rapid Automated Settlements)" };
    }

    function updateFloatingPositionMacro(sliderEl, floatingEl, minVal, maxVal, currentVal) {
        if (!sliderEl || !floatingEl) return;
        const clampedVal = Math.max(minVal, Math.min(maxVal, currentVal));
        const span = maxVal - minVal;
        const pct = span <= 0 ? 0 : Math.max(0, Math.min(100, ((clampedVal - minVal) / span) * 100));
        floatingEl.style.left = `${pct}%`;
        floatingEl.style.transform = `translateX(-${pct}%)`;
    }

    function calculateMacroEngineV3() {
        if (!sliderLivingCost || !sliderSupplyChain || !sliderVelocity) return;

        const annualLivingCostInput = parseFloat(sliderLivingCost.value) || 24000;
        const supplyChainMultiplierInput = parseFloat(sliderSupplyChain.value) || 70;
        const dailyVelocityInput = parseFloat(sliderVelocity.value) || 1.35;

        // Base Daily & Annual Metrics
        const dailyConsumerSpend = annualLivingCostInput / 365;
        const totalMultiplier = 1 + supplyChainMultiplierInput;
        const grossAnnualVolume = annualLivingCostInput * totalMultiplier;
        const annualTurns = dailyVelocityInput * 365;

        // Display labels for control sliders
        if (valLivingCost) {
            valLivingCost.innerHTML = `$${annualLivingCostInput.toLocaleString()} / yr <small>($${dailyConsumerSpend.toFixed(2)} / day)</small>`;
        }
        if (valSupplyChain) {
            valSupplyChain.textContent = `${supplyChainMultiplierInput} : 1`;
        }
        if (valVelocity) {
            if (dailyVelocityInput < 0.1) {
                valVelocity.textContent = `${annualTurns.toFixed(1)} turns/year`;
            } else {
                valVelocity.textContent = `${dailyVelocityInput.toFixed(3)} turns/day (${Math.round(annualTurns).toLocaleString()} turns/yr)`;
            }
        }

        // 1. Update Floating Category Tooltips & Positions
        const tierLiving = getLivingCostTier(annualLivingCostInput);
        if (tierLivingCostName) tierLivingCostName.textContent = tierLiving.name;
        if (tierLivingCostDesc) tierLivingCostDesc.textContent = tierLiving.desc;
        updateFloatingPositionMacro(sliderLivingCost, tierLivingCost, 12000, 48000, annualLivingCostInput);

        const tierSupply = getSupplyChainTier(supplyChainMultiplierInput);
        if (tierSupplyChainName) tierSupplyChainName.textContent = tierSupply.name;
        if (tierSupplyChainDesc) tierSupplyChainDesc.textContent = tierSupply.desc;
        updateFloatingPositionMacro(sliderSupplyChain, tierSupplyChain, 1, 100, supplyChainMultiplierInput);

        const tierVel = getVelocityTier(dailyVelocityInput);
        if (tierVelocityName) tierVelocityName.textContent = tierVel.name;
        if (tierVelocityDesc) tierVelocityDesc.textContent = tierVel.desc;
        updateFloatingPositionMacro(sliderVelocity, tierVelocity, 0.005, 5.0, dailyVelocityInput);

        // 2. Status Quo (Legacy Debt System) Calculations:
        // Sluggish velocity at 1.2 turns/year requires immense debt money supply
        const legacyDailyCOL = dailyConsumerSpend;
        const legacyMoneySupply = grossAnnualVolume / 1.2;
        const legacyAnnualInterest = legacyMoneySupply * 0.06; // 6% weighted average interest tribute
        const legacyDailyInterest = legacyAnnualInterest / 365;
        const legacyDailyTaxExtracted = legacyDailyCOL * 0.30; // ~30% taxes extracted
        const legacyDailyWelfareYield = (dailyConsumerSpend * totalMultiplier * (1.2 / 365)) * 0.014 * 0.75;
        const legacyNetPayout = legacyDailyWelfareYield - legacyDailyTaxExtracted; // Net negative tax drain
        const legacyNetDrainPct = (Math.abs(legacyNetPayout) / legacyDailyCOL) * 100;

        if (legacyDailyCostEl) legacyDailyCostEl.textContent = `$${legacyDailyCOL.toFixed(2)}/day`;
        if (legacyColSubtext) {
            legacyColSubtext.textContent = `Includes 40.0% compound interest overhead across ${supplyChainMultiplierInput} supply chain steps.`;
        }
        if (legacyNetPayoutEl) {
            legacyNetPayoutEl.textContent = `-$${Math.abs(legacyNetPayout).toFixed(2)}/day`;
        }
        if (legacyMoneySupplyEl) {
            legacyMoneySupplyEl.textContent = `$${Math.round(legacyMoneySupply).toLocaleString()}`;
        }
        if (legacyInterestCostEl) {
            legacyInterestCostEl.textContent = `$${legacyDailyInterest.toFixed(2)}/day ($${Math.round(legacyAnnualInterest).toLocaleString()}/yr)`;
        }
        if (legacyCoverageText) {
            legacyCoverageText.textContent = `-$${Math.abs(legacyNetPayout).toFixed(2)}/day (-${legacyNetDrainPct.toFixed(1)}% Net Tax Drain)`;
        }
        if (legacyProgressFill) {
            // Scale fill where 50% max tax drag equals 100% bar width
            const legacyBarFill = Math.min(100, Math.max(0, (legacyNetDrainPct / 50) * 100));
            legacyProgressFill.style.width = `${legacyBarFill}%`;
        }

        // 3. IOUBI Zero-Interest System Calculations:
        // Real cost of living drops 40% due to zero-interest supply chain
        const ioubiDailyCOL = dailyConsumerSpend * 0.60;
        const ioubiGrossDailyVolume = ioubiDailyCOL * totalMultiplier * dailyVelocityInput;
        const ioubiFeePool = ioubiGrossDailyVolume * 0.014;
        const ioubiDailyUBI = ioubiFeePool * 0.75;   // 75% UBI Dividend
        const ioubiDailySocial = ioubiFeePool * 0.20; // 20% Social Pool
        const ioubiDailyGov = ioubiFeePool * 0.05;    // 5% Government Operations
        const ioubiCoveragePercent = (ioubiDailyUBI / ioubiDailyCOL) * 100;
        const ioubiMoneySupply = (ioubiDailyCOL * totalMultiplier) / Math.max(0.001, dailyVelocityInput);

        if (ioubiDailyCostEl) ioubiDailyCostEl.innerHTML = `<span class="deltar-font">&#xE002;</span>${ioubiDailyCOL.toFixed(2)}/day`;
        if (ioubiDailyUbiEl) ioubiDailyUbiEl.innerHTML = `+<span class="deltar-font">&#xE002;</span>${ioubiDailyUBI.toFixed(2)}/day`;
        if (ioubiMoneySupplyEl) ioubiMoneySupplyEl.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(ioubiMoneySupply).toLocaleString()}`;
        if (ioubiInterestCostEl) ioubiInterestCostEl.innerHTML = `<span class="deltar-font">&#xE002;</span>0.00/yr (0.0%)`;

        if (ioubiCoverageText) {
            ioubiCoverageText.textContent = `${ioubiCoveragePercent.toFixed(1)}% Covered`;
            if (ioubiCoveragePercent >= 100) {
                ioubiCoverageText.className = 'emerald-text';
            } else if (ioubiCoveragePercent >= 80) {
                ioubiCoverageText.className = 'amber-text';
            } else {
                ioubiCoverageText.className = 'red-text';
            }
        }

        if (ioubiProgressFill) {
            // Range 0% to 300% where 100% target is at 33.33% of the track
            const ioubiBarFill = Math.min(100, Math.max(0, (ioubiCoveragePercent / 300) * 100));
            ioubiProgressFill.style.width = `${ioubiBarFill}%`;
            if (ioubiCoveragePercent >= 100) {
                ioubiProgressFill.style.background = '#00ff9d';
                ioubiProgressFill.style.boxShadow = '0 0 14px rgba(0, 255, 157, 0.6)';
            } else if (ioubiCoveragePercent >= 80) {
                ioubiProgressFill.style.background = '#f59e0b';
                ioubiProgressFill.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.6)';
            } else {
                ioubiProgressFill.style.background = '#ff4d4d';
                ioubiProgressFill.style.boxShadow = '0 0 10px rgba(255, 77, 77, 0.5)';
            }
        }

        if (ioubiPoolUbi) ioubiPoolUbi.textContent = ioubiDailyUBI.toFixed(2);
        if (ioubiPoolSocial) ioubiPoolSocial.textContent = ioubiDailySocial.toFixed(2);
        if (ioubiPoolGov) ioubiPoolGov.textContent = ioubiDailyGov.toFixed(2);

        if (ioubiOutcomeBanner) {
            if (ioubiCoveragePercent >= 100) {
                ioubiOutcomeBanner.innerHTML = `✓ ${ioubiCoveragePercent.toFixed(0)}% funded living floor with zero income taxes and zero systemic debt.`;
                ioubiOutcomeBanner.style.borderColor = '#00ff9d';
                ioubiOutcomeBanner.style.color = '#00ff9d';
                ioubiOutcomeBanner.style.background = 'rgba(0, 255, 157, 0.12)';
            } else {
                ioubiOutcomeBanner.innerHTML = `⚡ ${ioubiCoveragePercent.toFixed(0)}% of basic living floor covered. Adjust velocity or click "⚡ Solve Velocity for 100% Coverage".`;
                ioubiOutcomeBanner.style.borderColor = 'var(--accent-cyan)';
                ioubiOutcomeBanner.style.color = 'var(--accent-cyan)';
                ioubiOutcomeBanner.style.background = 'rgba(0, 240, 255, 0.12)';
            }
        }
    }
    window.calculateMacroEngineV3 = calculateMacroEngineV3;

    // Attach both 'input' and 'change' listeners to all 3 sliders
    [sliderLivingCost, sliderSupplyChain, sliderVelocity].forEach(el => {
        if (el) {
            ['input', 'change'].forEach(evt => {
                el.addEventListener(evt, calculateMacroEngineV3);
            });
        }
    });

    if (btnSolveCoverage && sliderVelocity) {
        btnSolveCoverage.addEventListener('click', () => {
            const supplyChainMultiplierInput = parseFloat(sliderSupplyChain ? sliderSupplyChain.value : 70) || 70;
            // Solve V: target velocity where coverage equals 100%
            // coverage = (1 + S) * V * 0.0105 = 1 => V = 1 / ((1 + S) * 0.0105)
            const targetV = 1 / ((1 + supplyChainMultiplierInput) * 0.0105);
            sliderVelocity.value = Math.min(5.0, Math.max(0.005, targetV)).toFixed(3);
            sliderVelocity.dispatchEvent(new Event('input'));
        });
    }

    calculateMacroEngineV3();

    // ----------------------------------------------------------------------
    // 6. FAQ & Knowledge Base Search and Accordion Controller
    // ----------------------------------------------------------------------
    const faqSearchInput = document.getElementById('faq-search-input');
    const faqSearchClear = document.getElementById('faq-search-clear');
    const faqFilterButtons = document.querySelectorAll('.faq-filter-pill');
    const faqAccordionItems = document.querySelectorAll('.faq-accordion-item');
    const faqCategoryGroups = document.querySelectorAll('.faq-category-group');
    const faqNoResults = document.getElementById('faq-no-results');

    let currentCategory = 'all';
    let searchQuery = '';

    // Accordion Toggle (Allows multiple items open simultaneously)
    faqAccordionItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        const pane = item.querySelector('.faq-answer-pane');

        if (btn && pane) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                if (isActive) {
                    item.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                    pane.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                    pane.style.maxHeight = pane.scrollHeight + 'px';
                }
            });
        }
    });

    // Update active pane heights on window resize
    window.addEventListener('resize', () => {
        document.querySelectorAll('.faq-accordion-item.active .faq-answer-pane').forEach(pane => {
            pane.style.maxHeight = pane.scrollHeight + 'px';
        });
    });

    // Filter & Search Engine
    function filterFaqItems() {
        const query = searchQuery.trim().toLowerCase();
        let totalVisible = 0;

        faqCategoryGroups.forEach(group => {
            const groupCategory = group.getAttribute('data-category');
            const isCategoryMatch = (currentCategory === 'all' || currentCategory === groupCategory);
            const itemsInGroup = group.querySelectorAll('.faq-accordion-item');
            let groupVisibleCount = 0;

            itemsInGroup.forEach(item => {
                const qText = item.querySelector('.faq-question-btn span')?.textContent.toLowerCase() || '';
                const aText = item.querySelector('.faq-answer-body')?.textContent.toLowerCase() || '';
                const matchesSearch = !query || qText.includes(query) || aText.includes(query);

                if (isCategoryMatch && matchesSearch) {
                    item.style.display = 'block';
                    groupVisibleCount++;
                    totalVisible++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (groupVisibleCount > 0) {
                group.style.display = 'flex';
            } else {
                group.style.display = 'none';
            }
        });

        if (faqNoResults) {
            faqNoResults.style.display = totalVisible === 0 ? 'block' : 'none';
        }
    }

    // Category Filter Pill Clicks
    faqFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            faqFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category') || 'all';
            filterFaqItems();
        });
    });

    // Real-time Search Input Listener
    if (faqSearchInput) {
        faqSearchInput.addEventListener('input', () => {
            searchQuery = faqSearchInput.value;
            if (faqSearchClear) {
                faqSearchClear.style.display = searchQuery ? 'block' : 'none';
            }
            filterFaqItems();
        });
    }

    // Clear Search Button
    if (faqSearchClear && faqSearchInput) {
        faqSearchClear.addEventListener('click', () => {
            faqSearchInput.value = '';
            searchQuery = '';
            faqSearchClear.style.display = 'none';
            faqSearchInput.focus();
            filterFaqItems();
        });
    }

    // ----------------------------------------------------------------------
    // 6B. Home & Asset Purchase Simulator (Major Purchase Engine)
    // ----------------------------------------------------------------------
    const mpElements = {
        // Section 1: Your Current Finances
        savingsSlider: document.getElementById('slider-mp-savings'),
        savingsInput: document.getElementById('input-mp-savings'),
        savingsVal: document.getElementById('val-mp-savings'),

        incomeSlider: document.getElementById('slider-mp-income'),
        incomeInput: document.getElementById('input-mp-income'),
        incomeVal: document.getElementById('val-mp-income'),

        housingSlider: document.getElementById('slider-mp-housing'),
        housingInput: document.getElementById('input-mp-housing'),
        housingVal: document.getElementById('val-mp-housing'),

        expensesSlider: document.getElementById('slider-mp-expenses'),
        expensesInput: document.getElementById('input-mp-expenses'),
        expensesVal: document.getElementById('val-mp-expenses'),

        insuranceSlider: document.getElementById('slider-mp-insurance'),
        insuranceInput: document.getElementById('input-mp-insurance'),
        insuranceVal: document.getElementById('val-mp-insurance'),

        // Section 2: Target Purchase & Community Boosts
        priceSlider: document.getElementById('slider-mp-price'),
        priceInput: document.getElementById('input-mp-price'),
        priceVal: document.getElementById('val-mp-price'),

        pclGiftSlider: document.getElementById('slider-mp-pcl-gift'),
        pclGiftInput: document.getElementById('input-mp-pcl-gift'),
        pclGiftVal: document.getElementById('val-mp-pcl-gift'),

        // Section 3: Network Defaults (Advanced)
        baseclSlider: document.getElementById('slider-mp-basecl'),
        baseclInput: document.getElementById('input-mp-basecl'),
        baseclVal: document.getElementById('val-mp-basecl'),

        regionalSlider: document.getElementById('slider-mp-regional'),
        regionalInput: document.getElementById('input-mp-regional'),
        regionalVal: document.getElementById('val-mp-regional'),

        txSlider: document.getElementById('slider-mp-tx'),
        txInput: document.getElementById('input-mp-tx'),
        txVal: document.getElementById('val-mp-tx'),

        // Output KPI Displays
        outDailyTrend: document.getElementById('mp-out-daily-trend'),
        outRampupSub: document.getElementById('mp-out-rampup-sub'),
        outRampupBadge: document.getElementById('mp-out-rampup-badge'),
        outPayoffYears: document.getElementById('mp-out-payoff-years'),
        outSafetyYears: document.getElementById('mp-out-safety-years'),
        outSafetySub: document.getElementById('mp-out-safety-sub'),
        outSurplusMonthly: document.getElementById('mp-out-surplus-monthly'),
        outSurplusSub: document.getElementById('mp-out-surplus-sub'),

        // Summary Mini-Card
        outNetOverdraft: document.getElementById('mp-out-net-overdraft'),
        outMonthlySurplus: document.getElementById('mp-out-monthly-surplus'),
        outSafeFloor: document.getElementById('mp-out-safe-floor'),

        // Chart Canvas & Tooltip
        canvas: document.getElementById('mp-runway-canvas'),
        canvasWrapper: document.getElementById('mp-canvas-wrapper'),
        tooltip: document.getElementById('mp-chart-tooltip'),

        // Advanced Accordion Toggle
        btnToggleAdvanced: document.getElementById('btn-toggle-mp-advanced'),
        advancedDrawer: document.getElementById('mp-advanced-drawer')
    };

    let mpChartData = [];
    let mpHoverData = null;
    let mpMaxYears = 10;
    let mpPurchasePrice = 200000;
    let mpOrganicPCLMagnitude = 262600;

    function syncMpPair(slider, input, badge, formatBadgeFn) {
        if (!slider || !input) return;
        slider.addEventListener('input', () => {
            input.value = slider.value;
            if (badge && formatBadgeFn) badge.innerHTML = formatBadgeFn(parseFloat(slider.value));
            calculateMajorPurchase();
        });
        input.addEventListener('input', () => {
            let val = parseFloat(input.value);
            if (isNaN(val)) val = parseFloat(slider.min);
            slider.value = val;
            if (badge && formatBadgeFn) badge.innerHTML = formatBadgeFn(val);
            calculateMajorPurchase();
        });
        input.addEventListener('blur', () => {
            let val = parseFloat(input.value);
            if (isNaN(val) || val < parseFloat(slider.min)) val = parseFloat(slider.min);
            if (val > parseFloat(slider.max)) val = parseFloat(slider.max);
            input.value = val;
            slider.value = val;
            if (badge && formatBadgeFn) badge.innerHTML = formatBadgeFn(val);
            calculateMajorPurchase();
        });
    }

    // Bind two-way syncs
    syncMpPair(mpElements.savingsSlider, mpElements.savingsInput, mpElements.savingsVal, v => `$${Math.round(v).toLocaleString()}`);
    syncMpPair(mpElements.incomeSlider, mpElements.incomeInput, mpElements.incomeVal, v => `$${Math.round(v).toLocaleString()}`);
    syncMpPair(mpElements.housingSlider, mpElements.housingInput, mpElements.housingVal, v => `$${Math.round(v).toLocaleString()}`);
    syncMpPair(mpElements.expensesSlider, mpElements.expensesInput, mpElements.expensesVal, v => `$${Math.round(v).toLocaleString()}`);
    syncMpPair(mpElements.insuranceSlider, mpElements.insuranceInput, mpElements.insuranceVal, v => `$${Math.round(v).toLocaleString()}`);

    syncMpPair(mpElements.priceSlider, mpElements.priceInput, mpElements.priceVal, v => `<span class="deltar-font">&#xE002;</span>${Math.round(v).toLocaleString()}`);
    syncMpPair(mpElements.pclGiftSlider, mpElements.pclGiftInput, mpElements.pclGiftVal, v => `<span class="deltar-font">&#xE002;</span>${Math.round(v).toLocaleString()}`);

    syncMpPair(mpElements.baseclSlider, mpElements.baseclInput, mpElements.baseclVal, v => `<span class="deltar-font">&#xE002;</span>${Math.round(v).toLocaleString()}`);
    syncMpPair(mpElements.regionalSlider, mpElements.regionalInput, mpElements.regionalVal, v => `${v.toFixed(1)}x`);
    syncMpPair(mpElements.txSlider, mpElements.txInput, mpElements.txVal, v => `${v.toFixed(1)}x`);

    // "Max Qualified For" button calculation
    const btnMpMaxQualified = document.getElementById('btn-mp-max-qualified');
    if (btnMpMaxQualified) {
        btnMpMaxQualified.addEventListener('click', () => {
            const savings_usd = parseFloat(mpElements.savingsSlider ? mpElements.savingsSlider.value : 0) || 0;
            const income_monthly = parseFloat(mpElements.incomeSlider ? mpElements.incomeSlider.value : 3000) || 0;
            const expenses_living = parseFloat(mpElements.expensesSlider ? mpElements.expensesSlider.value : 500) || 0;
            const pcl_gift = parseFloat(mpElements.pclGiftSlider ? mpElements.pclGiftSlider.value : 0) || 0;
            const base_cl = parseFloat(mpElements.baseclSlider ? mpElements.baseclSlider.value : 3000) || 3000;
            const regional_factor = parseFloat(mpElements.regionalSlider ? mpElements.regionalSlider.value : 1.2) || 1.2;
            const tx_factor = parseFloat(mpElements.txSlider ? mpElements.txSlider.value : 2.0) || 2.0;

            const fixedMultiplier = 1 + regional_factor + tx_factor;
            const monthlySurplus = Math.max(0, income_monthly - expenses_living);
            const dailyOrganicTrend = monthlySurplus / 30;

            // Sustainable organic ongoing credit capacity
            const organicSteadyPCLMagnitude = (base_cl * (fixedMultiplier + dailyOrganicTrend)) + pcl_gift;

            // Maximum asset purchase size: cash savings + maximum sustainable zero-interest overdraft line
            const maxQualified = Math.max(1, Math.round(savings_usd + organicSteadyPCLMagnitude));

            if (mpElements.priceSlider && mpElements.priceInput) {
                if (maxQualified > parseFloat(mpElements.priceSlider.max)) {
                    mpElements.priceSlider.max = Math.max(1500000, Math.ceil(maxQualified / 50000) * 50000);
                    mpElements.priceInput.max = mpElements.priceSlider.max;
                }
                mpElements.priceSlider.value = maxQualified;
                mpElements.priceInput.value = maxQualified;
                if (mpElements.priceVal) {
                    mpElements.priceVal.innerHTML = `<span class="deltar-font">&#xE002;</span>${maxQualified.toLocaleString()}`;
                }
                calculateMajorPurchase();
            }
        });
    }

    // Advanced accordion toggle
    if (mpElements.btnToggleAdvanced && mpElements.advancedDrawer) {
        mpElements.btnToggleAdvanced.addEventListener('click', () => {
            const isOpen = mpElements.advancedDrawer.classList.contains('open');
            if (isOpen) {
                mpElements.advancedDrawer.classList.remove('open');
                mpElements.btnToggleAdvanced.classList.remove('open');
                mpElements.btnToggleAdvanced.setAttribute('aria-expanded', 'false');
            } else {
                mpElements.advancedDrawer.classList.add('open');
                mpElements.btnToggleAdvanced.classList.add('open');
                mpElements.btnToggleAdvanced.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Reactive Calculation Engine
    function calculateMajorPurchase() {
        if (!mpElements.savingsSlider) return;

        const savings_usd = parseFloat(mpElements.savingsSlider.value) || 0;
        const income_monthly = parseFloat(mpElements.incomeSlider.value) || 0;
        const housing_cost_eliminated = parseFloat(mpElements.housingSlider.value) || 0;
        const expenses_living = parseFloat(mpElements.expensesSlider.value) || 0;
        const insurance_cost_eliminated = parseFloat(mpElements.insuranceSlider.value) || 0;

        const purchase_price = parseFloat(mpElements.priceSlider.value) || 200000;
        const pcl_gift = parseFloat(mpElements.pclGiftSlider.value) || 0;

        const base_cl = parseFloat(mpElements.baseclSlider.value) || 3000;
        const regional_factor = parseFloat(mpElements.regionalSlider.value) || 1.2;
        const tx_factor = parseFloat(mpElements.txSlider.value) || 2.0;

        // 1. Structural Fixed Multipliers
        const fixedMultiplier = 1 + regional_factor + tx_factor;

        // 2. Minimum Permanent Credit Line Floor (Positive scalar magnitude)
        const safeFloorMagnitude = (base_cl * (fixedMultiplier + 1.0)) + pcl_gift;

        // 3. Pre-Purchase Qualification Requirements (46-day Median Rule)
        const netOverdraftNeeded = Math.max(0, purchase_price - savings_usd);
        const targetPCL = Math.max(0, netOverdraftNeeded - pcl_gift);
        const requiredDailyTrend = Math.max(1.0, (targetPCL / base_cl) - fixedMultiplier);

        const rampUpDays = 46;
        const cashNeededForRampUp = rampUpDays * requiredDailyTrend;
        const canSelfFundRampUp = savings_usd >= cashNeededForRampUp;

        // 4. Post-Purchase Monthly Cash Flow & Amortization
        const postPurchaseExpenses = expenses_living;
        const monthlySurplus = Math.max(0, income_monthly - postPurchaseExpenses);
        const dailyOrganicTrend = monthlySurplus / 30;

        const organicSteadyPCLMagnitude = (base_cl * (fixedMultiplier + dailyOrganicTrend)) + pcl_gift;

        const annualSurplus = monthlySurplus * 12;
        const yearsToFullPayoff = annualSurplus > 0 ? (netOverdraftNeeded / annualSurplus) : Infinity;

        const debtBelowFloor = Math.max(0, netOverdraftNeeded - safeFloorMagnitude);
        const yearsToSafeFloor = annualSurplus > 0 ? (debtBelowFloor / annualSurplus) : 0;

        // 5. Dynamic Time-Series Generator (With Organic Economic Wavering)
        const totalSteps = 120;
        const maxYears = Math.max(5, Math.min(30, Math.ceil(isFinite(yearsToFullPayoff) ? yearsToFullPayoff * 1.15 : 30)));
        mpMaxYears = maxYears;
        mpPurchasePrice = purchase_price;
        mpOrganicPCLMagnitude = organicSteadyPCLMagnitude;

        mpChartData = [];
        for (let i = 0; i <= totalSteps; i++) {
            const t = (i / totalSteps) * maxYears;
            const balance = Math.min(0, -netOverdraftNeeded + (annualSurplus * t));
            const economicWave = Math.sin(t * 3.2) * 0.035 + Math.cos(t * 7.8) * 0.02 + Math.sin(t * 14.5) * 0.01;
            const fluctuatingOrganicPCL = -(organicSteadyPCLMagnitude * (1 + economicWave));
            const fluctuatingSafeFloor = -(safeFloorMagnitude * (1 + (economicWave * 0.6)));

            mpChartData.push({
                timeYears: parseFloat(t.toFixed(2)),
                balance: Math.round(balance),
                organicPCL: Math.round(fluctuatingOrganicPCL),
                safeFloor: Math.round(fluctuatingSafeFloor)
            });
        }

        // 6. Update KPI Cards in DOM
        if (mpElements.outDailyTrend) {
            mpElements.outDailyTrend.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(requiredDailyTrend).toLocaleString()}/day`;
        }
        if (mpElements.outRampupSub) {
            mpElements.outRampupSub.textContent = `46 days required at this rate ($${Math.round(cashNeededForRampUp).toLocaleString()} total transferred)`;
        }
        if (mpElements.outRampupBadge) {
            if (canSelfFundRampUp) {
                mpElements.outRampupBadge.className = 'mp-kpi-status-badge emerald-badge';
                mpElements.outRampupBadge.textContent = '✓ Fundable via Savings';
            } else {
                mpElements.outRampupBadge.className = 'mp-kpi-status-badge amber-badge';
                mpElements.outRampupBadge.textContent = '⚠ Requires Additional Income or PCL Gift';
            }
        }
        if (mpElements.outPayoffYears) {
            mpElements.outPayoffYears.textContent = isFinite(yearsToFullPayoff) ? `${yearsToFullPayoff.toFixed(1)} Years` : '∞ (Zero Surplus)';
        }
        if (mpElements.outSafetyYears) {
            mpElements.outSafetyYears.textContent = `${yearsToSafeFloor.toFixed(1)} Years`;
        }
        if (mpElements.outSafetySub) {
            mpElements.outSafetySub.textContent = `When overdraft balance climbs above -$${Math.round(safeFloorMagnitude).toLocaleString()}, spending cannot freeze regardless of daily trend fluctuations.`;
        }
        if (mpElements.outSurplusMonthly) {
            mpElements.outSurplusMonthly.textContent = `$${Math.round(monthlySurplus).toLocaleString()}/mo`;
        }
        if (mpElements.outSurplusSub) {
            mpElements.outSurplusSub.textContent = `Freed from rent ($${Math.round(housing_cost_eliminated).toLocaleString()}) and interest.`;
        }

        // Summary Mini-Card
        if (mpElements.outNetOverdraft) {
            mpElements.outNetOverdraft.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(netOverdraftNeeded).toLocaleString()}`;
        }
        if (mpElements.outMonthlySurplus) {
            mpElements.outMonthlySurplus.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(monthlySurplus).toLocaleString()}/mo`;
        }
        if (mpElements.outSafeFloor) {
            mpElements.outSafeFloor.innerHTML = `<span class="deltar-font">&#xE002;</span>${Math.round(safeFloorMagnitude).toLocaleString()}`;
        }

        drawMajorPurchaseChart();
    }

    // Chart Renderer
    function drawMajorPurchaseChart() {
        const canvas = mpElements.canvas;
        if (!canvas || !mpChartData || mpChartData.length === 0) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.resetTransform ? ctx.resetTransform() : ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        const padLeft = 85;
        const padRight = 35;
        const padTop = 35;
        const padBottom = 40;
        const plotWidth = width - padLeft - padRight;
        const plotHeight = height - padTop - padBottom;

        ctx.clearRect(0, 0, width, height);

        // Y-axis Depth Scaling
        const depthMin = -Math.ceil(Math.max(mpPurchasePrice, mpOrganicPCLMagnitude * 1.1) * 1.08);
        const yMin = depthMin;
        const yMax = Math.max(5000, Math.round(Math.abs(yMin) * 0.05));
        const yRange = yMax - yMin;

        function getX(t) {
            return padLeft + (t / mpMaxYears) * plotWidth;
        }

        function getY(val) {
            return padTop + ((yMax - val) / yRange) * plotHeight;
        }

        // Draw horizontal grid lines & Y-Axis labels
        const numTicks = 6;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (let i = 0; i <= numTicks; i++) {
            const rawVal = yMin + (i / numTicks) * (0 - yMin);
            const roundVal = Math.round(rawVal / 5000) * 5000;
            const yPos = getY(roundVal);

            if (yPos >= padTop && yPos <= padTop + plotHeight) {
                ctx.beginPath();
                ctx.strokeStyle = roundVal === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.07)';
                ctx.lineWidth = roundVal === 0 ? 1.5 : 1;
                ctx.setLineDash(roundVal === 0 ? [] : [4, 4]);
                ctx.moveTo(padLeft, yPos);
                ctx.lineTo(padLeft + plotWidth, yPos);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = roundVal === 0 ? '#ffffff' : 'rgba(148, 163, 184, 0.8)';
                let labelStr = roundVal === 0 ? '0' : `-${Math.abs(roundVal).toLocaleString()}`;
                ctx.fillText(labelStr, padLeft - 10, yPos);
            }
        }

        // Reference Zero Line (Solid horizontal divider at y = 0)
        const yZero = getY(0);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.moveTo(padLeft, yZero);
        ctx.lineTo(padLeft + plotWidth, yZero);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('0 (Debt-Free Baseline)', padLeft + 8, yZero - 8);

        // X-Axis horizontal ticks & labels
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '11px "JetBrains Mono", monospace';

        const xStep = mpMaxYears <= 10 ? 2 : 5;
        for (let t = 0; t <= mpMaxYears; t += xStep) {
            const xPos = getX(t);
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.moveTo(xPos, padTop + plotHeight);
            ctx.lineTo(xPos, padTop + plotHeight + 5);
            ctx.stroke();
            ctx.fillText(`${t} yr`, xPos, padTop + plotHeight + 8);
        }

        // Axis Titles
        ctx.save();
        ctx.translate(18, padTop + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('Balance & Overdraft Limit (deltars)', 0, 0);
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('Years Post-Purchase', padLeft + plotWidth / 2, height - 14);

        // Series 2: Organic Dynamic Credit Line (Muted green dashed curve)
        ctx.beginPath();
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        mpChartData.forEach((pt, idx) => {
            const x = getX(pt.timeYears);
            const y = getY(pt.organicPCL);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Series 3: Permanent Baseline Credit Floor (Muted amber dotted line)
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        mpChartData.forEach((pt, idx) => {
            const x = getX(pt.timeYears);
            const y = getY(pt.safeFloor);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Series 1: Account Overdraft Balance (Solid line with soft area fill upward toward zero)
        ctx.beginPath();
        ctx.moveTo(getX(mpChartData[0].timeYears), getY(mpChartData[0].balance));
        mpChartData.forEach(pt => {
            ctx.lineTo(getX(pt.timeYears), getY(pt.balance));
        });
        ctx.lineTo(getX(mpChartData[mpChartData.length - 1].timeYears), yZero);
        ctx.lineTo(getX(mpChartData[0].timeYears), yZero);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, getY(0), 0, getY(depthMin));
        grad.addColorStop(0, 'rgba(0, 243, 255, 0.35)');
        grad.addColorStop(0.5, 'rgba(0, 243, 255, 0.12)');
        grad.addColorStop(1, 'rgba(0, 243, 255, 0.02)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 3;
        mpChartData.forEach((pt, idx) => {
            const x = getX(pt.timeYears);
            const y = getY(pt.balance);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Hover Crosshair & Indicators
        if (mpHoverData) {
            const hx = getX(mpHoverData.timeYears);
            const hyBal = getY(mpHoverData.balance);
            const hyPCL = getY(mpHoverData.organicPCL);
            const hySafe = getY(mpHoverData.safeFloor);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.setLineDash([3, 3]);
            ctx.lineWidth = 1;
            ctx.moveTo(hx, padTop);
            ctx.lineTo(hx, padTop + plotHeight);
            ctx.stroke();
            ctx.setLineDash([]);

            // Balance dot
            ctx.beginPath();
            ctx.arc(hx, hyBal, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#00f3ff';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Dynamic PCL dot
            ctx.beginPath();
            ctx.arc(hx, hyPCL, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00ff9d';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Safe Floor dot
            ctx.beginPath();
            ctx.arc(hx, hySafe, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    // Canvas Mouse Interaction (Hover Tooltip)
    if (mpElements.canvasWrapper && mpElements.canvas) {
        mpElements.canvasWrapper.addEventListener('mousemove', (e) => {
            const rect = mpElements.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const padLeft = 85;
            const padRight = 35;
            const plotWidth = rect.width - padLeft - padRight;

            if (mouseX < padLeft || mouseX > rect.width - padRight || !mpChartData || mpChartData.length === 0) {
                mpHoverData = null;
                if (mpElements.tooltip) mpElements.tooltip.style.display = 'none';
                drawMajorPurchaseChart();
                return;
            }

            const tMouse = ((mouseX - padLeft) / plotWidth) * mpMaxYears;
            let closestPt = mpChartData[0];
            let minDiff = Math.abs(closestPt.timeYears - tMouse);
            for (let i = 1; i < mpChartData.length; i++) {
                const diff = Math.abs(mpChartData[i].timeYears - tMouse);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestPt = mpChartData[i];
                }
            }

            mpHoverData = closestPt;
            drawMajorPurchaseChart();

            if (mpElements.tooltip) {
                mpElements.tooltip.style.display = 'block';
                mpElements.tooltip.innerHTML = `
                    <div class="tt-year">Year ${closestPt.timeYears.toFixed(2)} Post-Purchase</div>
                    <div class="tt-row">
                        <span style="color: #94a3b8;">Overdraft Balance:</span>
                        <strong style="color: #00f3ff;">-\uE002 ${Math.abs(closestPt.balance).toLocaleString()}</strong>
                    </div>
                    <div class="tt-row">
                        <span style="color: #94a3b8;">Remaining Debt:</span>
                        <strong style="color: #ffffff;">\uE002 ${Math.max(0, -closestPt.balance).toLocaleString()}</strong>
                    </div>
                    <div class="tt-row">
                        <span style="color: #94a3b8;">Dynamic Credit Limit:</span>
                        <strong style="color: #00ff9d;">-\uE002 ${Math.abs(closestPt.organicPCL).toLocaleString()}</strong>
                    </div>
                    <div class="tt-row">
                        <span style="color: #94a3b8;">Permanent Safety Floor:</span>
                        <strong style="color: #f59e0b;">-\uE002 ${Math.abs(closestPt.safeFloor).toLocaleString()}</strong>
                    </div>
                `;

                const tooltipWidth = 270;
                let leftPos = mouseX + 15;
                if (leftPos + tooltipWidth > rect.width) {
                    leftPos = mouseX - tooltipWidth - 15;
                }
                const mouseY = e.clientY - rect.top;
                let topPos = Math.max(10, mouseY - 70);
                mpElements.tooltip.style.left = `${leftPos}px`;
                mpElements.tooltip.style.top = `${topPos}px`;
            }
        });

        mpElements.canvasWrapper.addEventListener('mouseleave', () => {
            mpHoverData = null;
            if (mpElements.tooltip) mpElements.tooltip.style.display = 'none';
            drawMajorPurchaseChart();
        });
    }

    window.calculateMajorPurchase = calculateMajorPurchase;

    // ----------------------------------------------------------------------
    // 7. Navigation & Simulators Dropdown Controller
    // ----------------------------------------------------------------------
    const simDropdownBtn = document.getElementById('sim-dropdown-btn');
    const simDropdown = document.getElementById('simulators-dropdown');
    const simDropdownMenu = document.getElementById('sim-dropdown-menu');

    if (simDropdownBtn && simDropdown) {
        simDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = simDropdown.classList.contains('open');
            if (isOpen) {
                simDropdown.classList.remove('open');
                simDropdownBtn.setAttribute('aria-expanded', 'false');
            } else {
                simDropdown.classList.add('open');
                simDropdownBtn.setAttribute('aria-expanded', 'true');
            }
            switchView('view-simulators', 'macro-balance-engine');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!simDropdown.contains(e.target)) {
                simDropdown.classList.remove('open');
                simDropdownBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close dropdown when selecting an item
        if (simDropdownMenu) {
            simDropdownMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    simDropdown.classList.remove('open');
                    simDropdownBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    // ----------------------------------------------------------------------
    // 8. Simulator View Isolation & Master Router (Single-DOM Tab Architecture)
    // ----------------------------------------------------------------------
    const viewRoutes = {
        '': { view: 'view-overview', anchor: null },
        '/': { view: 'view-overview', anchor: null },
        '#': { view: 'view-overview', anchor: null },
        '#overview': { view: 'view-overview', anchor: null },
        '#specs': { view: 'view-overview', anchor: 'specs' },
        '#mechanics': { view: 'view-overview', anchor: 'mechanics' },
        '#hero': { view: 'view-overview', anchor: 'hero' },
        '#simulators': { view: 'view-simulators', anchor: 'macro-balance-engine' },
        '#macro-balance-engine': { view: 'view-simulators', anchor: 'macro-balance-engine' },
        '#macro-economy': { view: 'view-simulators', anchor: 'macro-balance-engine' },
        '/simulators/macro-economy': { view: 'view-simulators', anchor: 'macro-balance-engine' },
        '#/simulators/macro-economy': { view: 'view-simulators', anchor: 'macro-balance-engine' },
        '#credit-sim-card': { view: 'view-simulators', anchor: 'credit-sim-card' },
        '#credit-simulator': { view: 'view-simulators', anchor: 'credit-sim-card' },
        '/simulators/credit-simulator': { view: 'view-simulators', anchor: 'credit-sim-card' },
        '#/simulators/credit-simulator': { view: 'view-simulators', anchor: 'credit-sim-card' },
        '#fee-calc-card': { view: 'view-simulators', anchor: 'fee-calc-card' },
        '#fee-calculator': { view: 'view-simulators', anchor: 'fee-calc-card' },
        '/simulators/fee-calculator': { view: 'view-simulators', anchor: 'fee-calc-card' },
        '#/simulators/fee-calculator': { view: 'view-simulators', anchor: 'fee-calc-card' },
        '#major-purchase': { view: 'view-simulators', anchor: 'major-purchase-card' },
        '#major-purchase-card': { view: 'view-simulators', anchor: 'major-purchase-card' },
        '/simulators/major-purchase': { view: 'view-simulators', anchor: 'major-purchase-card' },
        '#/simulators/major-purchase': { view: 'view-simulators', anchor: 'major-purchase-card' },
        '#docs': { view: 'view-docs', anchor: null },
        '#faq': { view: 'view-faq', anchor: null },
        '#roadmap': { view: 'view-roadmap', anchor: null }
    };

    /**
     * View Isolation Rule: When any simulator is selected, unmount all other
     * simulator views. Only display one simulator on screen at any given time.
     */
    function switchSimulator(targetSimId) {
        if (!targetSimId) targetSimId = 'macro-balance-engine';
        let normId = targetSimId;
        if (targetSimId === 'macro-economy') normId = 'macro-balance-engine';
        if (targetSimId === 'credit-simulator') normId = 'credit-sim-card';
        if (targetSimId === 'fee-calculator') normId = 'fee-calc-card';
        if (targetSimId === 'major-purchase' || targetSimId === 'major-purchase-card' || targetSimId === '/simulators/major-purchase') normId = 'major-purchase-card';

        // 1. Unmount all other simulator panels, display ONLY the target panel
        document.querySelectorAll('.sim-panel').forEach(panel => {
            if (panel.id === normId) {
                panel.classList.add('active-sim');
            } else {
                panel.classList.remove('active-sim');
            }
        });

        // 2. Update simulator jump pills
        document.querySelectorAll('.sim-nav-pill').forEach(pill => {
            const pillTarget = pill.getAttribute('data-sim-target') || (pill.getAttribute('href') || '').replace('#', '');
            if (pillTarget === normId || pillTarget === targetSimId || (normId === 'major-purchase-card' && (pillTarget === 'major-purchase' || pillTarget === 'major-purchase-card'))) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        // 3. Update dropdown items
        if (simDropdownMenu) {
            simDropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                const itemAnchor = item.getAttribute('data-target-anchor') || (item.getAttribute('href') || '').replace('#', '');
                if (itemAnchor === normId || itemAnchor === targetSimId || (normId === 'major-purchase-card' && (itemAnchor === 'major-purchase' || itemAnchor === 'major-purchase-card'))) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // 4. Trigger calculations and chart redraws for the active simulator
        setTimeout(() => {
            if (normId === 'major-purchase-card' && typeof window.calculateMajorPurchase === 'function') {
                window.calculateMajorPurchase();
            } else if (normId === 'credit-sim-card' && typeof window.calculateCreditEngine === 'function') {
                window.calculateCreditEngine();
            } else if (normId === 'macro-balance-engine' && typeof window.calculateMacroEngineV3 === 'function') {
                window.calculateMacroEngineV3();
            } else if (normId === 'fee-calc-card' && typeof window.calculateFeeFormula === 'function') {
                window.calculateFeeFormula();
            }
        }, 50);
    }

    function switchView(targetViewId, targetAnchorId) {
        if (!targetViewId) targetViewId = 'view-overview';

        // 1. Toggle view tab display classes
        const viewTabs = document.querySelectorAll('.view-tab');
        viewTabs.forEach(tab => {
            if (tab.id === targetViewId) {
                tab.classList.remove('hidden-view');
                tab.classList.add('active-view');
            } else {
                tab.classList.remove('active-view');
                tab.classList.add('hidden-view');
            }
        });

        // 2. Update navigation active state
        document.querySelectorAll('.nav-link, .dropdown-item, .footer-nav-grid a').forEach(link => {
            const linkView = link.getAttribute('data-target-view');
            if (linkView === targetViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 3. Highlight Simulators dropdown toggle if inside simulators
        if (simDropdownBtn) {
            if (targetViewId === 'view-simulators') {
                simDropdownBtn.classList.add('active');
            } else {
                simDropdownBtn.classList.remove('active');
            }
        }

        // 4. If inside simulators view, enforce simulator isolation
        if (targetViewId === 'view-simulators') {
            const simId = targetAnchorId || 'macro-balance-engine';
            switchSimulator(simId);
        }

        // 5. Smooth scrolling
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleHashNavigation() {
        const hash = window.location.hash || '';
        const path = window.location.pathname || '';
        let route = viewRoutes[hash];

        if (!route) {
            if (hash.includes('major-purchase') || path.includes('major-purchase')) {
                route = viewRoutes['#major-purchase'];
            } else if (hash.includes('credit-simulator') || path.includes('credit-simulator') || hash.includes('credit-sim-card')) {
                route = viewRoutes['#credit-sim-card'];
            } else if (hash.includes('fee-calculator') || path.includes('fee-calculator') || hash.includes('fee-calc-card')) {
                route = viewRoutes['#fee-calc-card'];
            } else if (hash.includes('macro-economy') || path.includes('macro-economy') || hash.includes('macro-balance-engine')) {
                route = viewRoutes['#macro-balance-engine'];
            }
        }

        if (!route) {
            route = { view: 'view-overview', anchor: null };
        }
        switchView(route.view, route.anchor);
    }

    // Attach click listeners to all tab links and simulator pills
    document.querySelectorAll('.nav-tab-link, .sim-nav-pill').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetView = link.getAttribute('data-target-view');
            const targetAnchor = link.getAttribute('data-target-anchor') || link.getAttribute('data-sim-target');
            const href = link.getAttribute('href');

            if (link.classList.contains('sim-nav-pill')) {
                e.preventDefault();
                const simId = link.getAttribute('data-sim-target') || (href ? href.replace('#', '') : 'macro-balance-engine');
                switchSimulator(simId);
                const pushHash = simId === 'major-purchase-card' ? '#major-purchase' : '#' + simId;
                window.history.pushState(null, '', pushHash);
                return;
            }

            if (targetView) {
                e.preventDefault();
                switchView(targetView, targetAnchor);
                if (targetAnchor) {
                    window.history.pushState(null, '', '#' + targetAnchor);
                } else if (href && href.startsWith('#')) {
                    window.history.pushState(null, '', href);
                }
            } else if (href && href.startsWith('#')) {
                const anchorName = href.replace('#', '');
                for (const [rHash, rConfig] of Object.entries(viewRoutes)) {
                    if (rHash === href || rConfig.anchor === anchorName) {
                        e.preventDefault();
                        switchView(rConfig.view, rConfig.anchor || anchorName);
                        window.history.pushState(null, '', href);
                        break;
                    }
                }
            }
        });
    });

    window.addEventListener('hashchange', handleHashNavigation);

    // Initial View on load
    handleHashNavigation();

    // ----------------------------------------------------------------------
    // 9. Collapsible Plumbing & Fee Pool Drawer Controllers
    // ----------------------------------------------------------------------
    const btnTogglePlumbing = document.getElementById('btn-toggle-plumbing');
    const macroPlumbingDrawer = document.getElementById('macro-plumbing-drawer');

    if (btnTogglePlumbing && macroPlumbingDrawer) {
        btnTogglePlumbing.addEventListener('click', () => {
            const isOpen = macroPlumbingDrawer.classList.contains('open');
            if (isOpen) {
                macroPlumbingDrawer.classList.remove('open');
                btnTogglePlumbing.classList.remove('open');
                btnTogglePlumbing.setAttribute('aria-expanded', 'false');
            } else {
                macroPlumbingDrawer.classList.add('open');
                btnTogglePlumbing.classList.add('open');
                btnTogglePlumbing.setAttribute('aria-expanded', 'true');
            }
        });
    }

    const btnToggleFeePool = document.getElementById('btn-toggle-fee-pool');
    const feePoolDrawer = document.getElementById('fee-pool-drawer');

    if (btnToggleFeePool && feePoolDrawer) {
        btnToggleFeePool.addEventListener('click', () => {
            const isOpen = feePoolDrawer.classList.contains('open');
            if (isOpen) {
                feePoolDrawer.classList.remove('open');
                btnToggleFeePool.classList.remove('open');
                btnToggleFeePool.setAttribute('aria-expanded', 'false');
            } else {
                feePoolDrawer.classList.add('open');
                btnToggleFeePool.classList.add('open');
                btnToggleFeePool.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // ----------------------------------------------------------------------
    // 10. Dynamic Roadmap Progress Engine (34-Week Schedule & Calendar Tracking)
    // ----------------------------------------------------------------------
    function initRoadmapProgress() {
        const weekTicsContainer = document.getElementById('roadmap-week-tics');
        if (weekTicsContainer) {
            weekTicsContainer.innerHTML = '';
            const totalWeeks = 34;
            for (let w = 0; w <= totalWeeks; w++) {
                const tic = document.createElement('div');
                tic.className = 'week-tic' + (w % 4 === 0 ? ' major-tic' : '');
                weekTicsContainer.appendChild(tic);
            }
        }

        // Project Start: April 7, 2026
        const projectStartDate = new Date(2026, 3, 7);
        const now = new Date(); // Current date
        const totalWeeks = 34;
        const totalWorkdays = totalWeeks * 5; // 170 workdays

        // Account for 3-week (22-calendar-day) development delay between Phase 4 and Phase 5
        const delayCalendarDays = 22;

        // Calculate elapsed calendar days accounting for 3-week delay
        const diffTime = now.getTime() - projectStartDate.getTime();
        const rawCalendarDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        const elapsedCalendarDays = Math.max(0, rawCalendarDays - delayCalendarDays);

        // Convert calendar days to working days (5 working days per 7 calendar days)
        const elapsedFullWeeks = Math.floor(elapsedCalendarDays / 7);
        const remainingDays = elapsedCalendarDays % 7;
        const elapsedWorkdays = (elapsedFullWeeks * 5) + Math.min(5, remainingDays);

        // Progress percentage & current week (Day 1 of Week 19 => 53.5%, Week 19)
        const progressPct = Math.min(100, Math.max(0, (elapsedWorkdays / totalWorkdays) * 100));
        const currentWeekNum = Math.min(totalWeeks, Math.max(1, Math.floor(elapsedCalendarDays / 7) + 1));

        // Update UI Badges & Progress Fill Bar
        const badgeEl = document.getElementById('roadmap-pct-text');
        if (badgeEl) {
            badgeEl.textContent = `${progressPct.toFixed(1)}% Complete (Week ${currentWeekNum} of ${totalWeeks})`;
        }

        const navStatusBadge = document.getElementById('nav-status-badge');
        if (navStatusBadge) {
            navStatusBadge.innerHTML = `<span class="pulse-dot"></span> 2026 Core: ${progressPct.toFixed(1)}% | Week ${currentWeekNum}`;
        }

        const barFill = document.querySelector('.roadmap-timeline-bar-fill');
        if (barFill) {
            barFill.style.width = `${progressPct.toFixed(1)}%`;
        }
    }

    initRoadmapProgress();

    // ----------------------------------------------------------------------
    // 11. Roadmap Phase Milestone Nodes Tap / Click Handler (Mobile/Touch)
    // ----------------------------------------------------------------------
    const phaseNodes = document.querySelectorAll('.roadmap-phase-node');
    phaseNodes.forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const isAlreadyOpen = node.classList.contains('open');
            phaseNodes.forEach(n => n.classList.remove('open'));
            if (!isAlreadyOpen) {
                node.classList.add('open');
            }
        });
    });

    document.addEventListener('click', () => {
        phaseNodes.forEach(n => n.classList.remove('open'));
    });

    // ----------------------------------------------------------------------
    // 12. Initial Simulator Runs & Resize Redraws
    // ----------------------------------------------------------------------
    if (typeof window.calculateFeeFormula === 'function') {
        window.calculateFeeFormula();
    }
    if (typeof window.calculateCreditEngine === 'function') {
        window.calculateCreditEngine();
    }
    if (typeof window.calculateMacroEngineV3 === 'function') {
        window.calculateMacroEngineV3();
    }
    if (typeof window.calculateMajorPurchase === 'function') {
        window.calculateMajorPurchase();
    }

    window.addEventListener('resize', () => {
        if (typeof window.calculateCreditEngine === 'function') {
            window.calculateCreditEngine();
        }
        if (typeof window.calculateMacroEngineV3 === 'function') {
            window.calculateMacroEngineV3();
        }
        if (typeof window.calculateMajorPurchase === 'function') {
            window.calculateMajorPurchase();
        }
    });
});
