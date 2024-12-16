
// 전역 변수로 조명들 선언
let particleLight1, particleLight2, particleLight3;

// addLighting 함수에서 조명 추가
function addLighting() {
    // 기존 Directional Light
    const directionalLight = new THREE.DirectionalLight(0x655D5B,0);
    directionalLight.position.set(5, 5, 5).normalize();

    directionalLight.castShadow = true; // 그림자 활성화

// 그림자 설정 (해상도 및 범위 조정)
directionalLight.shadow.mapSize.width = 1024; // 그림자 맵 해상도
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1; // 근거리 클리핑
directionalLight.shadow.camera.far = 50;  // 원거리 클리핑
directionalLight.shadow.camera.left = -1; // 그림자 범위 (좌, 우, 위, 아래)
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;


    scene.add(directionalLight);

    // Ambient Light 추가
    const ambientLight = new THREE.AmbientLight(0xA4C294, 0);
    scene.add(ambientLight);

    // 첫 번째 Point Light (기존)

     // 후광 효과를 위한 셰이더 material 생성 함수
     function createGlowMaterial(color) {
        return new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(color) },
                viewVector: { value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(0.6 - dot(vNormal, vNormel), 4.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    gl_FragColor = vec4(glowColor, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
    }




    particleLight1 = new THREE.Mesh(
        new THREE.SphereGeometry(8, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xA4C294 })
    );

    const glow1 = new THREE.Mesh(
        new THREE.SphereGeometry(10, 16, 16),
        createGlowMaterial(0xA4C294)
    );
    particleLight1.add(glow1);
    scene.add(particleLight1);
    const pointLight1 = new THREE.PointLight(0xA4C294, 1, 800, 2);
    particleLight1.add(pointLight1);

    // 두 번째 Point Light
    particleLight2 = new THREE.Mesh(
        new THREE.SphereGeometry(4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xFFD78C })
    );

        // 후광 효과 추가
        const glow2 = new THREE.Mesh(
            new THREE.SphereGeometry(6, 16, 16),
            createGlowMaterial(0xFFD78C)
        );
        particleLight2.add(glow2);

    scene.add(particleLight2);
    const pointLight2 = new THREE.PointLight(0xFFD78C, 1, 800, 1);
    particleLight2.add(pointLight2);

    // 세 번째 Point Light
    particleLight3 = new THREE.Mesh(
        new THREE.SphereGeometry(4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x72363A })
    );

        // 후광 효과 추가
        const glow3 = new THREE.Mesh(
            new THREE.SphereGeometry(6, 16, 16),
            createGlowMaterial(0x72363A)
        );
        particleLight3.add(glow3);

        
    scene.add(particleLight3);
    const pointLight3 = new THREE.PointLight(0x72363A, 1, 800, 2);
    particleLight3.add(pointLight3);
}


// 페이지 로드 시 조명 추가
addLighting();
