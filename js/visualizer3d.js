/**
 * Interactive 3D Data Visualizer for Akhil Shibu Portfolio
 * Written in TypeScript for High-Performance Light-Mode Three.js Rendering
 */
export class DataVisualizer3D {
    container;
    scene;
    camera;
    renderer;
    animFrameId = null;
    currentMode = 'bars';
    // Scene Objects
    groupBars;
    groupTerrain;
    groupNetwork;
    gridHelper;
    raycaster;
    mouse;
    // Interaction State
    isDragging = false;
    prevMouseX = 0;
    prevMouseY = 0;
    rotSpeedX = 0.005;
    rotSpeedY = 0.005;
    targetRotationY = -0.55;
    targetRotationX = 0.45;
    currentRotationY = -0.55;
    currentRotationX = 0.45;
    barsData = [];
    barMeshes = [];
    tooltipEl = null;
    constructor(containerId) {
        const el = document.getElementById(containerId);
        if (!el) {
            throw new Error(`Visualizer container '#${containerId}' not found.`);
        }
        this.container = el;
        this.tooltipEl = document.getElementById('v3dTooltip');
        this.init();
    }
    init() {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js library not detected. Running fallback.');
            return;
        }
        const width = this.container.clientWidth || 460;
        const height = this.container.clientHeight || 340;
        // 1. Scene
        this.scene = new THREE.Scene();
        // 2. Camera (Isometric Orthographic or Field-of-View Perspective)
        this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
        this.camera.position.set(0, 7.5, 12);
        this.camera.lookAt(0, 0.5, 0);
        // 3. Renderer with Light Mode Color Profile
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        // 4. Studio Lighting for Professional Light Mode
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(12, 18, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.bias = -0.001;
        this.scene.add(dirLight);
        const hemiLight = new THREE.HemisphereLight(0x0284c7, 0xf8fafc, 0.4);
        this.scene.add(hemiLight);
        // 5. Ground Grid
        this.gridHelper = new THREE.GridHelper(10, 16, 0x0284c7, 0xe2e8f0);
        this.gridHelper.position.y = -0.02;
        this.scene.add(this.gridHelper);
        // 6. Build Scene Groups
        this.groupBars = new THREE.Group();
        this.groupTerrain = new THREE.Group();
        this.groupNetwork = new THREE.Group();
        this.scene.add(this.groupBars);
        this.scene.add(this.groupTerrain);
        this.scene.add(this.groupNetwork);
        this.buildBarsMode();
        this.buildTerrainMode();
        this.buildNetworkMode();
        this.setMode('bars');
        // 7. Raycasting & Mouse
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-999, -999);
        // 8. Event Listeners
        this.setupEventListeners();
        // 9. Start Render Loop
        this.animate();
    }
    buildBarsMode() {
        // 5x5 Matrix of Data Bars representing analytical dimensions
        const gridSize = 5;
        const spacing = 1.35;
        const offset = ((gridSize - 1) * spacing) / 2;
        const sampleMetrics = [
            { label: 'Ernakulam High-Fatality Cluster', metric: 'Kerala Road Safety', value: 3.64 },
            { label: 'Thiruvananthapuram Density', metric: 'Urban Accidents', value: 3.82 },
            { label: 'Datasentrix Validation Yield', metric: 'ETL Pipeline', value: 4.25 },
            { label: 'Bike Sales Road Tier Margin', metric: 'Retail Profitability', value: 4.10 },
            { label: 'Kollam Highway Corridors', metric: 'Geospatial Telemetry', value: 3.51 },
            { label: 'Mountain Category Growth', metric: 'Commercial Volume', value: 3.90 },
            { label: 'Z-Score Anomaly Rejection', metric: 'Data Hygiene', value: 2.80 },
            { label: 'Nighttime Severity Spike', metric: '20:00-04:00 Window', value: 4.50 },
            { label: 'Window Function Lag Delta', metric: 'SQL Optimization', value: 3.15 },
            { label: 'Deloitte Simulation Score', metric: 'Client Reporting', value: 4.40 }
        ];
        const boxGeo = new THREE.BoxGeometry(0.85, 1, 0.85);
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const metricIdx = (x * gridSize + z) % sampleMetrics.length;
                const meta = sampleMetrics[metricIdx];
                // Pseudo-random height derived from coordinates for stability
                const baseHeight = 0.6 + Math.sin(x * 0.8 + z * 0.9) * 0.8 + Math.cos(x * 0.5) * 0.7 + 1.2;
                const height = Math.max(0.5, Math.min(3.8, baseHeight));
                // Refined light-mode palette: sky cyan to indigo
                const color = new THREE.Color().lerpColors(new THREE.Color(0x0284c7), // Sky 600
                new THREE.Color(0x4f46e5), // Indigo 600
                (x + z) / ((gridSize - 1) * 2));
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.25,
                    metalness: 0.15
                });
                const bar = new THREE.Mesh(boxGeo, material);
                bar.scale.set(1, height, 1);
                bar.position.set(x * spacing - offset, height / 2, z * spacing - offset);
                bar.castShadow = true;
                bar.receiveShadow = true;
                bar.userData = {
                    meta: meta,
                    defaultHeight: height,
                    defaultColor: color,
                    origY: height / 2
                };
                this.groupBars.add(bar);
                this.barMeshes.push(bar);
            }
        }
    }
    buildTerrainMode() {
        const size = 6.5;
        const segments = 24;
        const geom = new THREE.PlaneGeometry(size, size, segments, segments);
        geom.rotateX(-Math.PI / 2);
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vz = pos.getZ(i);
            const vy = Math.sin(vx * 1.2) * Math.cos(vz * 1.2) * 0.8 + Math.sin(vx * 0.5 + vz * 0.8) * 0.4;
            pos.setY(i, vy + 0.8);
        }
        geom.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({
            color: 0x0891b2,
            roughness: 0.4,
            metalness: 0.1,
            wireframe: false,
            side: THREE.DoubleSide
        });
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xbae6fd,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const mesh = new THREE.Mesh(geom, mat);
        const wireMesh = new THREE.Mesh(geom, wireMat);
        wireMesh.position.y = 0.02;
        this.groupTerrain.add(mesh);
        this.groupTerrain.add(wireMesh);
    }
    buildNetworkMode() {
        const nodeCount = 18;
        const nodes = [];
        const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
        for (let i = 0; i < nodeCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 2.2 + Math.random() * 0.8;
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = Math.max(0.2, (r * Math.sin(phi) * Math.sin(theta)) + 1.4);
            const z = r * Math.cos(phi);
            const mat = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0x0284c7 : 0x059669,
                roughness: 0.2,
                metalness: 0.2
            });
            const sphere = new THREE.Mesh(sphereGeo, mat);
            sphere.position.set(x, y, z);
            this.groupNetwork.add(sphere);
            nodes.push(sphere.position);
        }
        // Connect close nodes with lines
        const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.45 });
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].distanceTo(nodes[j]) < 2.0) {
                    const lineGeo = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
                    const line = new THREE.Line(lineGeo, lineMat);
                    this.groupNetwork.add(line);
                }
            }
        }
    }
    setMode(mode) {
        this.currentMode = mode;
        this.groupBars.visible = mode === 'bars';
        this.groupTerrain.visible = mode === 'terrain';
        this.groupNetwork.visible = mode === 'network';
        if (this.tooltipEl) {
            this.tooltipEl.style.opacity = '0';
        }
    }
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        // Mouse drag rotation
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.prevMouseX = e.clientX;
            this.prevMouseY = e.clientY;
        });
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            if (this.isDragging) {
                const deltaX = e.clientX - this.prevMouseX;
                const deltaY = e.clientY - this.prevMouseY;
                this.targetRotationY += deltaX * this.rotSpeedX;
                this.targetRotationX = Math.max(0.15, Math.min(1.2, this.targetRotationX + deltaY * this.rotSpeedY));
                this.prevMouseX = e.clientX;
                this.prevMouseY = e.clientY;
            }
        });
        // Touch support for mobile
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.prevMouseX = e.touches[0].clientX;
                this.prevMouseY = e.touches[0].clientY;
            }
        }, { passive: true });
        canvas.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - this.prevMouseX;
                const deltaY = e.touches[0].clientY - this.prevMouseY;
                this.targetRotationY += deltaX * this.rotSpeedX;
                this.targetRotationX = Math.max(0.15, Math.min(1.2, this.targetRotationX + deltaY * this.rotSpeedY));
                this.prevMouseX = e.touches[0].clientX;
                this.prevMouseY = e.touches[0].clientY;
            }
        }, { passive: true });
        window.addEventListener('touchend', () => {
            this.isDragging = false;
        });
        // Resize handling
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }
    onResize() {
        if (!this.container || !this.renderer || !this.camera)
            return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    animate = () => {
        this.animFrameId = requestAnimationFrame(this.animate);
        // Smooth inertia interpolation
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;
        // Gentle continuous slow spin when not dragging
        if (!this.isDragging) {
            this.targetRotationY += 0.0018;
        }
        const currentGroup = this.getCurrentGroup();
        if (currentGroup) {
            currentGroup.rotation.y = this.currentRotationY;
            currentGroup.rotation.x = this.currentRotationX;
        }
        this.gridHelper.rotation.y = this.currentRotationY;
        // Raycast hover in bars mode
        if (this.currentMode === 'bars') {
            this.handleBarHover();
        }
        this.renderer.render(this.scene, this.camera);
    };
    getCurrentGroup() {
        if (this.currentMode === 'bars')
            return this.groupBars;
        if (this.currentMode === 'terrain')
            return this.groupTerrain;
        return this.groupNetwork;
    }
    handleBarHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.barMeshes);
        // Reset all bars
        this.barMeshes.forEach(mesh => {
            mesh.material.color.copy(mesh.userData.defaultColor);
        });
        if (intersects.length > 0) {
            const hit = intersects[0].object;
            hit.material.color.setHex(0x059669); // Emerald highlight on hover
            if (this.tooltipEl && hit.userData.meta) {
                const meta = hit.userData.meta;
                this.tooltipEl.innerHTML = `
          <strong>${meta.label}</strong><br>
          <span style="color:#0284c7;">${meta.metric}</span>: <strong>${meta.value}</strong>
        `;
                this.tooltipEl.style.opacity = '1';
            }
        }
        else {
            if (this.tooltipEl) {
                this.tooltipEl.style.opacity = '0';
            }
        }
    }
    destroy() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
        if (this.renderer && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}
