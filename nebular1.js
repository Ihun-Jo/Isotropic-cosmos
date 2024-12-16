


function createNebulaCloud() {
    const nebulaGroup = new THREE.Group();

    const cloudCount = 0; // 성운 덩어리 개수
    for (let i = 0; i < cloudCount; i++) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        
        // ShaderMaterial로 블러 처리 구현
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(0xff4500) }, // 성운 색상
                uIntensity: { value: 1.0 }, // 성운 밝기
                uBlur: { value: 2.0 }, // 블러 강도
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec4 vWorldPosition;
                void main() {
                    vPosition = position;
                    vWorldPosition = modelMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vPosition;
                varying vec4 vWorldPosition;
                uniform vec3 uColor;
                uniform float uIntensity;
                uniform float uBlur;

                void main() {
                    // 거리 기반으로 블러 처리
                    float dist = length(vPosition) / uBlur; 
                    
                    // 중심에서 멀어질수록 투명
                    float alpha = 1.0 - smoothstep(0.3, 1.2, dist);

                    // 색상과 투명도 적용
                    gl_FragColor = vec4(uColor, alpha * uIntensity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });

        const cloud = new THREE.Mesh(geometry, material);

        // 랜덤 위치와 크기 설정
        cloud.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        cloud.scale.set(
            Math.random() * 2 + 1,
            Math.random() * 2 + 1,
            Math.random() * 2 + 1
        );

        nebulaGroup.add(cloud);
    }

    scene.add(nebulaGroup); // 씬에 추가
}

// 성운 클라우드 생성
createNebulaCloud();

