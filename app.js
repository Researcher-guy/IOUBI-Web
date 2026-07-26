/* ==========================================================================
   IOUBI Web Portal - Central Engine, Concept Knowledge Matrix & Simulators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // Concept Repository Data Model (Parsed from Master Concept Document)
    // ----------------------------------------------------------------------
    const conceptRepo = {
        'money-iou': {
            id: 'money-iou',
            category: 'value',
            catName: '1. Value & Time',
            title: 'Money is the Receipt of an IOU',
            summary: 'Money is simply a standardized placeholder to track mismatches in trade timing or quantity.',
            fullText: `Traditional barter fails because trades rarely match in value and timing. Money is not intrinsic wealth; it is a ledger receipt tracking who owes what to society. In IOUBI, currency standardizes trade imbalances while eliminating financial profit extraction on the ledger itself.`,
            codependents: ['human-labor-standard', 'personal-conversion', 'time-peg']
        },
        'human-labor-standard': {
            id: 'human-labor-standard',
            category: 'value',
            catName: '1. Value & Time',
            title: 'Human Labor as the Root Standard',
            summary: 'Physical goods and services are ultimately measured by the human effort required to produce them.',
            fullText: `Whether gold, oil, or government decree, all historical currencies derive trust from human productive effort. IOUBI cuts out arbitrary middleman pegs by adopting human time directly as the global foundation of value.`,
            codependents: ['money-iou', 'favors', 'personal-conversion']
        },
        'personal-conversion': {
            id: 'personal-conversion',
            category: 'value',
            catName: '1. Value & Time',
            title: 'Personal Delta Conversion Rate',
            summary: 'Each individual chooses how much time their personal effort unit is worth to them.',
            fullText: `While the Deltar remains a stable global benchmark, each human freely sets their personal conversion rate (e.g. a mechanic valuing their unit at 10 minutes vs. a surgeon at 2 seconds). Both pay identical Deltar prices for a loaf of bread, but their time effort reflects their personal decision. The global Deltar value settles at the collective average of everyone's choices.`,
            codependents: ['human-labor-standard', 'favors', 'rainwater-abundance']
        },
        'favors': {
            id: 'favors',
            category: 'value',
            catName: '1. Value & Time',
            title: '3-Minute Favors',
            summary: 'The standardized base unit of trade in the human economy.',
            fullText: `The 3-Minute Favor is the unbreakable baseline metric. It anchors day-to-day exchanges to real, accessible human activity, eliminating financial abstraction.`,
            codependents: ['human-labor-standard', 'personal-conversion', 'time-peg']
        },
        'time-peg': {
            id: 'time-peg',
            category: 'value',
            catName: '1. Value & Time',
            title: 'The Time Peg ("Borrowing from Yourself")',
            summary: 'Drawing liquidity from the system is simply moving future personal time to the present.',
            fullText: `In legacy finance, borrowing incurs compounding financial friction on future effort. IOUBI allows members to overdraft against their personal credit limit by borrowing from their future self and repaying by providing value to society later, naturally postponing repayment without financial traps.`,
            codependents: ['money-iou', 'net-balance-ledger', 'scl-donations']
        },
        'rainwater-abundance': {
            id: 'rainwater-abundance',
            category: 'value',
            catName: '1. Value & Time',
            title: 'Rainwater Abundance (The End Game)',
            summary: 'As automation replaces manual jobs, currency becomes like abundant rainwater falling on gardens.',
            fullText: `IOUBI scales seamlessly from 1,000 users to 10 billion. As AI and automation take over physical supply chains, marginal costs fall to near zero. Deltars simply act as a production management metric for automated systems—abundant and free, like rainwater nourishing tomato gardens.`,
            codependents: ['personal-conversion', 'dividend-split', 'musical-cages']
        },
        'log10-fee': {
            id: 'log10-fee',
            category: 'friction',
            catName: '2. Contribution Math',
            title: '1% Per Zero Log10 Contribution Surcharge',
            summary: 'Transaction contribution rate scales logarithmically based on account balance zeros.',
            fullText: `The system charges a minimum 1% shared contribution split equally between payor and payee. For larger balances, the contribution rate percentage equals the average of the Log10 zeros of both accounts: Rate% = average(Log10(max(10, Bal1)), Log10(max(10, Bal2))). A trade between two 1,000,000,000 Deltar accounts contributes 9%, incentivizing liquidity to trade with smaller accounts (dropping the contribution to 5%) and funding the commons pool.`,
            codependents: ['midnight-tally', 'dividend-split', 'net-balance-ledger']
        },
        'net-balance-ledger': {
            id: 'net-balance-ledger',
            category: 'friction',
            catName: '2. Contribution Math',
            title: 'Lifetime Net Balance Ledger',
            summary: 'Currency volume matches total active societal credit and vanishes upon repayment.',
            fullText: `Currency is only created when individuals draw credit and is destroyed when repaid. Accounts with positive balances hold receipts for value provided; negative balances indicate time owed to society. If everyone repaid their net balance, total currency volume would collapse to zero, proving 100% economic equilibrium.`,
            codependents: ['time-peg', 'log10-fee', 'scl-donations']
        },
        'musical-cages': {
            id: 'musical-cages',
            category: 'friction',
            catName: '2. Contribution Math',
            title: 'Opting Out of Musical Cages',
            summary: 'Financialized rent-seeking traps every social class in a battle for shrinking resources.',
            fullText: `Traditional financial competition forces corporations, individuals, and governments to optimize for pure extraction rather than physical utility. IOUBI eliminates systemic distortions, replacing the "race to the bottom" with a race to real product value.`,
            codependents: ['money-iou', 'rainwater-abundance', 'human-labor-standard']
        },
        'midnight-tally': {
            id: 'commons',
            catName: '3. Commons Safety Net',
            title: 'Midnight Pool Tally',
            summary: 'Collected transaction contributions are deleted from circulation and recreated daily into a global pool.',
            fullText: `Every transaction sliver is automatically tracked, destroyed, and recreated at midnight in a unified global pool. This pool instantly funds automatic dividends, healthcare insurance, and community grants with zero administrative overhead.`,
            codependents: ['log10-fee', 'dividend-split', 'jury-voting']
        },
        'dividend-split': {
            id: 'dividend-split',
            category: 'commons',
            catName: '3. Commons Safety Net',
            title: '75 / 20 / 5 Automatic Dividend Pool Split',
            summary: 'Daily pool is split into 75% Automatic Dividend, 20% Social/Grant pool, and 5% Government donations.',
            fullText: `Initial global allocation distributes 75% directly to all individual account ledgers as usable baseline Automatic Dividend of Collective Efforts, 20% to an insurance/grant fund, and 5% to member-directed government accounts. Members can vote daily to shift these proportions.`,
            codependents: ['midnight-tally', 'jury-voting', 'scl-donations']
        },
        'jury-voting': {
            id: 'jury-voting',
            category: 'commons',
            catName: '3. Commons Safety Net',
            title: 'Jury-Style Shift Voting & 0.001% Drift',
            summary: 'Voluntary single-shift juries review insurance/grant claims and guide pool percentage voting.',
            fullText: `Members serve voluntary one-shift jury duty to review insurance and grant applications. Upon completing their shift, their votes inform the global population. Unanimous global voting can drift pool allocation percentages by 0.001% per day (requiring 1,000 days for a 1% shift), ensuring extreme stability against volatility.`,
            codependents: ['midnight-tally', 'dividend-split', 'rainwater-abundance']
        },
        'scl-donations': {
            id: 'business',
            catName: '4. Business & SCL',
            title: 'Social Credit Limit (SCL) Crowdfunding',
            summary: 'Personal accounts donate SCL to expand a business overdraft limit without financial leverage.',
            fullText: `Business accounts do not receive daily Automatic Dividends or vote on pool rates. To fund capital expenses, businesses raise SCL donations from personal members. Each personal account generates 1/365th of their Personal Credit Limit daily as non-usable SCL, which can only be donated to support businesses they believe in.`,
            codependents: ['time-peg', 'scl-decay', 'crowd-assembly']
        },
        'scl-decay': {
            id: 'business',
            catName: '4. Business & SCL',
            title: '25% Quarterly SCL Decay',
            summary: 'Donated business credit limit vanishes by 25% each quarter unless renewed or earned back.',
            fullText: `To prevent stagnant corporate hoarders, donated SCL expires on a 3-month schedule—decaying 25% per quarter. If a business's revenue does not raise its net balance above the decaying limit, spending is halted until new crowd SCL is raised.`,
            codependents: ['scl-donations', 'crowd-assembly', 'net-balance-ledger']
        },
        'crowd-assembly': {
            id: 'business',
            catName: '4. Business & SCL',
            title: '25-Donor Minimum Assembly Rule',
            summary: 'SCL donation events require a minimum crowd of 25 donors to enforce deliberation.',
            fullText: `To prevent single wealthy accounts from dictating business creation, SCL donations must occur in groups of at least 25 people. Furthermore, the largest donor cannot contribute more than 4x the smallest donor in the assembly, guaranteeing democratic community discussion.`,
            codependents: ['scl-donations', 'scl-decay', 'musical-cages']
        }
    };

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

        if (targetId === 'architecture') {
            setTimeout(resizeTopologyCanvas, 100);
        }
    }

    navButtons.forEach(btn => btn.addEventListener('click', () => switchPage(btn.dataset.target)));
    routerCards.forEach(card => card.addEventListener('click', () => switchPage(card.dataset.target)));
    ctaButtons.forEach(btn => btn.addEventListener('click', () => switchPage(btn.dataset.target)));

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(`page-${initialHash}`)) {
        switchPage(initialHash);
    }

    // ----------------------------------------------------------------------
    // 2. Global Hover Tooltip & Modal System
    // ----------------------------------------------------------------------
    const tooltip = document.getElementById('concept-bubble-tooltip');
    const tooltipCategory = document.getElementById('tooltip-category');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipBody = document.getElementById('tooltip-body');
    const tooltipCodepTags = document.getElementById('tooltip-codep-tags');
    const tooltipDeepdiveBtn = document.getElementById('tooltip-deepdive-btn');

    const modalOverlay = document.getElementById('concept-modal-overlay');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCodepGrid = document.getElementById('modal-codependent-grid');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    let currentConceptId = null;

    function showTooltip(conceptId, mouseEvent) {
        const concept = conceptRepo[conceptId];
        if (!concept) return;

        currentConceptId = conceptId;
        tooltipCategory.textContent = concept.catName;
        tooltipTitle.textContent = concept.title;
        tooltipBody.textContent = concept.summary;

        // Render co-dependent tags
        tooltipCodepTags.innerHTML = concept.codependents.map(depId => {
            const dep = conceptRepo[depId];
            return dep ? `<span class="tag-item" data-concept="${depId}">${dep.title}</span>` : '';
        }).join('');

        // Attach event listeners to tooltip tags
        tooltipCodepTags.querySelectorAll('.tag-item').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(tag.dataset.concept);
            });
        });

        // Position tooltip
        const x = Math.min(window.innerWidth - 340, Math.max(10, mouseEvent.clientX + 15));
        const y = Math.min(window.innerHeight - 250, Math.max(10, mouseEvent.clientY + 15));

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.classList.add('visible');
    }

    function hideTooltip() {
        tooltip.classList.remove('visible');
    }

    function openModal(conceptId) {
        const concept = conceptRepo[conceptId];
        if (!concept) return;

        hideTooltip();
        modalCategory.textContent = concept.catName;
        modalTitle.textContent = concept.title;
        modalContent.innerHTML = `<p>${concept.fullText}</p>`;

        modalCodepGrid.innerHTML = concept.codependents.map(depId => {
            const dep = conceptRepo[depId];
            if (!dep) return '';
            return `
                <div class="codep-card" data-concept="${depId}">
                    <h5>${dep.title}</h5>
                    <small>${dep.summary}</small>
                </div>
            `;
        }).join('');

        modalCodepGrid.querySelectorAll('.codep-card').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.concept));
        });

        modalOverlay.classList.add('visible');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('visible'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
        });
    }

    if (tooltipDeepdiveBtn) {
        tooltipDeepdiveBtn.addEventListener('click', () => {
            if (currentConceptId) openModal(currentConceptId);
        });
    }

    // Attach hover listeners to all concept terms across the site
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('.concept-term, .cloud-word[data-concept]');
        if (target && target.dataset.concept) {
            showTooltip(target.dataset.concept, e);
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.concept-term, .cloud-word[data-concept]');
        if (target) {
            // Delay hide to check if moving inside tooltip
            setTimeout(() => {
                if (!tooltip.matches(':hover')) hideTooltip();
            }, 100);
        }
    });

    tooltip.addEventListener('mouseleave', hideTooltip);

    // ----------------------------------------------------------------------
    // 3. Render Concept Knowledge Matrix (Blueprint Page)
    // ----------------------------------------------------------------------
    const conceptMatrixContainer = document.getElementById('concept-matrix');
    const filterButtons = document.querySelectorAll('.filter-btn');

    function renderConceptMatrix(filterCategory = 'all') {
        if (!conceptMatrixContainer) return;

        const filteredKeys = Object.keys(conceptRepo).filter(key => {
            if (filterCategory === 'all') return true;
            return conceptRepo[key].category === filterCategory;
        });

        conceptMatrixContainer.innerHTML = filteredKeys.map(key => {
            const concept = conceptRepo[key];
            return `
                <div class="matrix-concept-card" data-concept="${concept.id}">
                    <div>
                        <span class="concept-cat-badge">${concept.catName}</span>
                        <h3>${concept.title}</h3>
                        <p>${concept.summary}</p>
                    </div>
                    <div class="matrix-card-footer">
                        <span class="codep-count">${concept.codependents.length} Linked Nodes</span>
                        <span class="inspect-link">Deep-Dive &rarr;</span>
                    </div>
                </div>
            `;
        }).join('');

        conceptMatrixContainer.querySelectorAll('.matrix-concept-card').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.concept));
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderConceptMatrix(btn.dataset.filter);
        });
    });

    renderConceptMatrix('all');

    // ----------------------------------------------------------------------
    // 4. Background Particle Network Canvas Animation
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
    // 5. Interactive Sankey Diagram Visualizer Engine (Blueprint Page)
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
    // 6. Interactive Node Topology Canvas Engine (Architecture Map Page)
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
    // 7. Interactive Tool 1: 1% Per Zero Calculator (Sandbox Page)
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
    // 8. Interactive Tool 2: Test the Equilibrium Simulator (Sandbox Page)
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
    // 9. Interactive Tool 3: SCL Business Crowdfund Simulator
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
        const totalRaised = raisedPerPerson * donors * 100; // Simulated donation pool
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
