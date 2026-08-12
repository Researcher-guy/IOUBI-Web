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

    // Bidirectional sync for Payor Account's Balance
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

    // Bidirectional sync for Payee Account's Balance
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

    // Bidirectional sync for Conversion Rate & Slider
    if (inputConversionRate && sliderConversionRate) {
        inputConversionRate.addEventListener('input', () => {
            let val = parseFloat(inputConversionRate.value);
            if (val < 0.01) {
                val = 0.01;
                inputConversionRate.value = val;
            }
            sliderConversionRate.value = rateToSliderPos(val);
            calculatePerZero();
        });
        sliderConversionRate.addEventListener('input', () => {
            const calculatedRate = sliderPosToRate(parseInt(sliderConversionRate.value, 10));
            inputConversionRate.value = calculatedRate;
            calculatePerZero();
        });
    }

    if (inputTxAmount) {
        inputTxAmount.addEventListener('input', () => {
            if (parseFloat(inputTxAmount.value) < 0) inputTxAmount.value = 0;
            calculatePerZero();
        });
    }

    calculatePerZero();

    // ----------------------------------------------------------------------
    // 4. Social Credit Limit (SCL) Business Crowdfund Simulator
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

    // ----------------------------------------------------------------------
    // 5. Macroeconomic Simulator & Dividend Engine (Revised V2 Engine)
    // ----------------------------------------------------------------------
    const sliderLivingCost = document.getElementById('slider-living-cost');
    const sliderMoneySupply = document.getElementById('slider-money-supply');
    const sliderSupplyChain = document.getElementById('slider-supply-chain');
    const sliderVelocity = document.getElementById('slider-velocity');

    const valLivingCost = document.getElementById('val-living-cost');
    const valMoneySupply = document.getElementById('val-money-supply');
    const valSupplyChain = document.getElementById('val-supply-chain');
    const valVelocity = document.getElementById('val-velocity');
    const btnSolveCoverage = document.getElementById('btn-solve-coverage');

    const legacyDailyCostEl = document.getElementById('legacy-daily-cost');
    const legacyDailyYieldEl = document.getElementById('legacy-daily-yield');
    const legacyColSubtext = document.getElementById('legacy-col-subtext');
    const legacyCoverageText = document.getElementById('legacy-coverage-text');
    const legacyProgressFill = document.getElementById('legacy-progress-fill');

    const ioubiDailyCostEl = document.getElementById('ioubi-daily-cost');
    const ioubiDailyUbiEl = document.getElementById('ioubi-daily-ubi');
    const ioubiCoverageText = document.getElementById('ioubi-coverage-text');
    const ioubiProgressFill = document.getElementById('ioubi-progress-fill');

    const ioubiPoolUbi = document.getElementById('ioubi-pool-ubi');
    const ioubiPoolSocial = document.getElementById('ioubi-pool-social');
    const ioubiPoolGov = document.getElementById('ioubi-pool-gov');
    const ioubiOutcomeBanner = document.getElementById('ioubi-outcome-banner');

    function calculateMacroEngineV2() {
        if (!sliderLivingCost || !sliderMoneySupply || !sliderSupplyChain || !sliderVelocity) return;

        const targetAnnualCOL = parseFloat(sliderLivingCost.value) || 24000;
        const moneySupplyM = parseFloat(sliderMoneySupply.value) || 24000;
        const supplyChainS = parseFloat(sliderSupplyChain.value) || 70;
        const velocityV = parseFloat(sliderVelocity.value) || 1.35;

        // Display labels for control sliders
        const legacyDailyCOL = targetAnnualCOL / 365;
        const annualTurns = Math.round(velocityV * 365);

        if (valLivingCost) {
            valLivingCost.innerHTML = `$${targetAnnualCOL.toLocaleString()} / yr <small>($${legacyDailyCOL.toFixed(2)} / day)</small>`;
        }
        if (valMoneySupply) {
            valMoneySupply.textContent = `$${moneySupplyM.toLocaleString()} / person`;
        }
        if (valSupplyChain) {
            valSupplyChain.textContent = `${supplyChainS} : 1`;
        }
        if (valVelocity) {
            valVelocity.textContent = `${velocityV.toFixed(3)} turns/day (${annualTurns.toLocaleString()} turns/yr)`;
        }

        // 1. Legacy System Calculations
        const legacyInterestOverheadRate = Math.min(0.40, (moneySupplyM / 60000) * 0.40);
        const legacyDailyCOLWithInterest = legacyDailyCOL / Math.max(0.01, (1 - legacyInterestOverheadRate));
        const legacyGrossDailyVolume = moneySupplyM * velocityV * (supplyChainS / 70);
        const legacyDailyFeeYield = legacyGrossDailyVolume * 0.014 * 0.75;
        const legacyCoveragePercent = (legacyDailyFeeYield / legacyDailyCOLWithInterest) * 100;

        if (legacyDailyCostEl) legacyDailyCostEl.textContent = `$${legacyDailyCOLWithInterest.toFixed(2)}/day`;
        if (legacyDailyYieldEl) legacyDailyYieldEl.textContent = `$${legacyDailyFeeYield.toFixed(2)}/day`;
        if (legacyColSubtext) {
            legacyColSubtext.textContent = `Includes ${(legacyInterestOverheadRate * 100).toFixed(1)}% compound interest overhead from $${moneySupplyM.toLocaleString()} debt stock.`;
        }
        if (legacyCoverageText) {
            legacyCoverageText.textContent = `${legacyCoveragePercent.toFixed(1)}% Covered`;
        }
        if (legacyProgressFill) {
            legacyProgressFill.style.width = `${Math.min(100, Math.max(0, legacyCoveragePercent))}%`;
        }

        // 2. IOUBI Zero-Interest System Calculations
        const ioubiDailyCOL = legacyDailyCOL; // Zero interest overhead
        const ioubiGrossDailyVolume = moneySupplyM * velocityV * (supplyChainS / 70);
        const ioubiDailyFeePool = ioubiGrossDailyVolume * 0.014;
        const ioubiDailyUBI = ioubiDailyFeePool * 0.75;
        const ioubiDailySocial = ioubiDailyFeePool * 0.20;
        const ioubiDailyGov = ioubiDailyFeePool * 0.05;
        const ioubiCoveragePercent = (ioubiDailyUBI / ioubiDailyCOL) * 100;

        if (ioubiDailyCostEl) ioubiDailyCostEl.innerHTML = `<span class="deltar-font">&#xE002;</span>${ioubiDailyCOL.toFixed(2)}/day`;
        if (ioubiDailyUbiEl) ioubiDailyUbiEl.innerHTML = `<span class="deltar-font">&#xE002;</span>${ioubiDailyUBI.toFixed(2)}/day`;

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
            ioubiProgressFill.style.width = `${Math.min(100, Math.max(0, ioubiCoveragePercent))}%`;
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

    [sliderLivingCost, sliderMoneySupply, sliderSupplyChain, sliderVelocity].forEach(el => {
        if (el) el.addEventListener('input', calculateMacroEngineV2);
    });

    if (btnSolveCoverage && sliderVelocity) {
        btnSolveCoverage.addEventListener('click', () => {
            const targetAnnualCOL = parseFloat(sliderLivingCost.value) || 24000;
            const moneySupplyM = parseFloat(sliderMoneySupply.value) || 24000;
            const supplyChainS = parseFloat(sliderSupplyChain.value) || 70;

            const ioubiDailyCOL = targetAnnualCOL / 365;
            // Solve V: ioubiDailyCOL = moneySupplyM * V * (supplyChainS / 70) * 0.014 * 0.75
            // V = ioubiDailyCOL / (moneySupplyM * (supplyChainS / 70) * 0.0105)
            const denominator = moneySupplyM * (supplyChainS / 70) * 0.0105;
            const targetV = denominator > 0 ? (ioubiDailyCOL / denominator) : 1.35;

            sliderVelocity.value = Math.min(5.0, Math.max(0.005, targetV)).toFixed(3);
            calculateMacroEngineV2();
        });
    }

    calculateMacroEngineV2();
});
