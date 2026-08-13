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

        const rawBalA = Math.max(0, parseFloat(inputBalA.value) || 0);
        const rawBalB = Math.max(0, parseFloat(inputBalB.value) || 0);

        // Floor of 10 for log function resulting in log floor of 1.00
        const logA = Math.log10(Math.max(10, rawBalA));
        const logB = Math.log10(Math.max(10, rawBalB));

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
        const txHours = txAmount / convRate;
        if (txTimeEquiv) txTimeEquiv.textContent = formatSmartDuration(txHours);

        const feeAmount = txAmount * (avgFeePct / 100);
        const receivedAmount = txAmount - feeAmount;

        const feeHours = feeAmount / convRate;
        const receivedHours = receivedAmount / convRate;

        // Transaction settlement row displays with comma separators
        if (tblPaid) tblPaid.textContent = formatNumberWithCommas(txAmount, 3);
        if (tblPaidTime) tblPaidTime.textContent = formatSmartDuration(txHours);

        if (tblFee) tblFee.textContent = formatNumberWithCommas(feeAmount, 3);
        if (tblFeeTime) tblFeeTime.textContent = formatSmartDuration(feeHours);

        if (tblReceived) tblReceived.textContent = formatNumberWithCommas(receivedAmount, 3);
        if (tblReceivedTime) tblReceivedTime.textContent = formatSmartDuration(receivedHours);

        // Pool breakdown: 100% Pool, UBI (75%), Social (20%), Gov (5%)
        const ubiFee = feeAmount * 0.75;
        const socialFee = feeAmount * 0.20;
        const govFee = feeAmount * 0.05;

        if (tblPool) tblPool.textContent = formatNumberWithCommas(feeAmount, 3);
        if (tblPoolTime) tblPoolTime.textContent = formatSmartDuration(feeHours);

        if (tblUbi) tblUbi.textContent = formatNumberWithCommas(ubiFee, 3);
        if (tblUbiTime) tblUbiTime.textContent = formatSmartDuration(ubiFee / convRate);

        if (tblSocial) tblSocial.textContent = formatNumberWithCommas(socialFee, 3);
        if (tblSocialTime) tblSocialTime.textContent = formatSmartDuration(socialFee / convRate);

        if (tblGov) tblGov.textContent = formatNumberWithCommas(govFee, 3);
        if (tblGovTime) tblGovTime.textContent = formatSmartDuration(govFee / convRate);
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

    if (inputTxAmount) {
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

        const padLeft = 65;
        const padRight = 25;
        const padTop = 25;
        const padBottom = 35;

        const graphW = w - padLeft - padRight;
        const graphH = h - padTop - padBottom;

        const maxCap = Math.max(1000, initialCredit * 1.45);

        // 9 Checkpoints: 0m, 3m, 6m (Renewal Event), 9m, 12m, 15m, 18m (Ramps to 0), 21m, 24m
        const quarters = [
            { m: 0, label: 'M0', decay: 1.0 },
            { m: 3, label: 'M3', decay: 0.75 },
            { m: 6, label: 'M6', decay: 1.25 },   // 6-Month Renewal Boost (+100% batch added to remaining 50%)
            { m: 9, label: 'M9', decay: 1.00 },   // 25% decay on both batches
            { m: 12, label: 'M12', decay: 0.50 }, // Batch 1 expires, Batch 2 at 50%
            { m: 15, label: 'M15', decay: 0.25 }, // Batch 2 at 25%
            { m: 18, label: 'M18', decay: 0.00 }, // Batch 2 expires (Zero Mark)
            { m: 21, label: 'M21', decay: 0.00 },
            { m: 24, label: 'M24', decay: 0.00 }
        ];

        // Draw horizontal grid lines & Y-axis labels
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'right';

        const ySteps = 4;
        for (let i = 0; i <= ySteps; i++) {
            const val = (maxCap / ySteps) * i;
            const y = padTop + graphH - (i / ySteps) * graphH;

            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(w - padRight, y);
            ctx.stroke();

            let valStr = '0';
            if (val >= 1000000) valStr = (val / 1000000).toFixed(1) + 'M';
            else if (val >= 1000) valStr = Math.round(val / 1000) + 'k';
            else valStr = Math.round(val).toString();

            ctx.fillText('Δ' + valStr, padLeft - 8, y + 3);
        }

        // Draw X-axis grid lines & Month labels
        ctx.textAlign = 'center';
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

        // 2. Draw Enterprise Overdraft Utilization Curve (Amber Oscillating Spikes Ramping to 0 at M18)
        ctx.beginPath();
        const curvePoints = [];
        const subSteps = 64; // Smooth interpolation across 24 months
        for (let s = 0; s <= subSteps; s++) {
            const monthFrac = (s / subSteps) * 24;
            const x = padLeft + (monthFrac / 24) * graphW;

            // Determine active ceiling at this month
            let activeCeiling = 0;
            if (monthFrac < 3) activeCeiling = initialCredit * 1.0;
            else if (monthFrac < 6) activeCeiling = initialCredit * 0.75;
            else if (monthFrac < 9) activeCeiling = initialCredit * 1.25; // 6-Mo Renewal Boost
            else if (monthFrac < 12) activeCeiling = initialCredit * 1.00;
            else if (monthFrac < 15) activeCeiling = initialCredit * 0.50;
            else if (monthFrac < 18) activeCeiling = initialCredit * 0.25;
            else activeCeiling = 0; // Expired at M18

            // Utilization spikes rising to slightly fill steps, ramping to zero at M18
            let actualUtilization = 0;
            if (monthFrac < 18) {
                const rampFactor = Math.max(0, 1 - (monthFrac / 18));
                const wave = 0.60 + 0.28 * Math.sin(monthFrac * 1.6);
                actualUtilization = activeCeiling * Math.max(0.18, Math.min(0.88, wave)) * Math.sqrt(rampFactor);
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
        const trend = parseFloat(sliderTrend.value) || 2.0;
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

        // 2. Personal Credit Limit (PCL) Calculation
        const PCL = (baseCL * R) + (baseCL * trend * activity);
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

        if (valTrend) valTrend.textContent = `${trend.toFixed(1)}x`;
        if (descTrendMain && descTrendDesc) {
            if (trend === 1.0) {
                descTrendMain.textContent = 'Flat / Neutral History';
                descTrendDesc.textContent = '(1.0x Baseline Floor)';
            } else if (trend <= 5.0) {
                descTrendMain.textContent = 'Steady Positive Trend';
                descTrendDesc.textContent = '(Consistent Earning & Savings)';
            } else if (trend <= 20.0) {
                descTrendMain.textContent = 'Strong Motivated Savings';
                descTrendDesc.textContent = '(Active Credit Building)';
            } else {
                descTrendMain.textContent = 'Exceptional Capital Growth';
                descTrendDesc.textContent = '(Motivated Savings & Elite Credit Building)';
            }
        }
        updateFloatingPosition(sliderTrend, descTrend, 1.0, 100.0, trend);

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
                descUnusedSCLDesc.textContent = '(Active Gifting Reserve)';
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
            outPCLFormula.textContent = `(${Math.round(baseCL).toLocaleString()} × ${R.toFixed(1)}) + (${Math.round(baseCL).toLocaleString()} × ${trend.toFixed(1)} × ${activity.toFixed(1)})`;
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
            if (outConsensusStatus) outConsensusStatus.textContent = '✓ Compliant (Min 25 Backers | Max Gift ≤ 4x Min Gift)';

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
            if (sliderTrend) sliderTrend.value = 2.0;
            if (sliderActivity) sliderActivity.value = 2.0;
            if (sliderBackers) sliderBackers.value = 50;
            if (sliderDmin) sliderDmin.value = 4000;
            if (sliderDmax) {
                sliderDmax.max = 16000;
                sliderDmax.value = 16000;
            }
            // PCL = 20,000 -> max unused SCL = 40,000
            if (sliderUnusedSCL) {
                sliderUnusedSCL.max = 40000;
                sliderUnusedSCL.value = 20000;
            }
        } else if (stage === 'mature') {
            if (sliderBaseCL) sliderBaseCL.value = 10000;
            if (sliderSpend) sliderSpend.value = 5;
            if (sliderTrend) sliderTrend.value = 2.0;
            if (sliderActivity) sliderActivity.value = 2.0;
            if (sliderBackers) sliderBackers.value = 500;
            if (sliderDmin) sliderDmin.value = 20000;
            if (sliderDmax) {
                sliderDmax.max = 80000;
                sliderDmax.value = 80000;
            }
            // PCL = 50,000 -> max unused SCL = 100,000
            if (sliderUnusedSCL) {
                sliderUnusedSCL.max = 100000;
                sliderUnusedSCL.value = 50000;
            }
        }

        [btnPresetEarly, btnPresetMid, btnPresetMature].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (stage === 'early' && btnPresetEarly) btnPresetEarly.classList.add('active');
        if (stage === 'mid' && btnPresetMid) btnPresetMid.classList.add('active');
        if (stage === 'mature' && btnPresetMature) btnPresetMature.classList.add('active');

        calculateCreditEngine();
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
            calculateMacroEngineV3();
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
});
