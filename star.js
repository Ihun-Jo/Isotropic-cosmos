// 스타 이미지를 추가하는 함수
function addStars(imageUrl, count) {
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load(imageUrl);

    for (let i = 0; i < count; i++) {
        // 랜덤한 위치 생성
        const x = Math.random() * 20 - 10; 
        const y = Math.random() * 20 - 10; 
        const z = Math.random() * 20 - 10; 

        const size = Math.random() *  0.8 + 0.1;

        // ShaderMaterial을 사용한 glow 효과 추가
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "c": { type: "f", value: 1.0 }, // glow 강도
                "p": { type: "f", value: 9.0 }, // glow 확산 정도
                glowColor: { type: "c", value: new THREE.Color(0x72363A) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        // 스프라이트와 glow를 각각의 그룹에 추가
        const starMaterial = new THREE.SpriteMaterial({ map: starTexture, color: 0xffffff, transparent: true });
        const star = new THREE.Sprite(starMaterial);
        star.position.set(x, y, z);
        star.scale.set(size, size, size);

        const glow = new THREE.Mesh(new THREE.TorusGeometry(size * 1, size * 0.1, 16, 100), glowMaterial);
        glow.position.set(x, y, z);

        // 별과 glow를 그룹화
        const starGroup = new THREE.Group();
        starGroup.add(star);
        starGroup.add(glow);

        // 씬에 추가
        scene.add(starGroup);
    }
}


// 스타 이미지 추가
addStars('star.png', 20); // star.png를 20개 추가
addStars('star2.png', 20);
addStars('star3.png', 20);

// 스타 이미지를 추가하는 함수
function addObjects(imageUrl, count) {
    const textureLoader = new THREE.TextureLoader();
    const ObjectTexture = textureLoader.load(imageUrl);

    for (let i = 0; i < count; i++) {
        // 랜덤한 위치 생성
        const x = Math.random() * 20 - 10; 
        const y = Math.random() * 20 - 10; 
        const z = Math.random() * 20 - 10; 

        const size = Math.random() * 0.8 + 0.1;

        // 스프라이트와 glow를 각각의 그룹에 추가
        const ObjectMaterial = new THREE.SpriteMaterial({ map: ObjectTexture, color: 0xffffff, transparent: true });
        const Object = new THREE.Sprite(ObjectMaterial);
        Object.position.set(x, y, z);
        Object.scale.set(size, size, size);

    

        // 별과 glow를 그룹화
        const ObjectGroup = new THREE.Group();
        ObjectGroup.add(Object);

        // 씬에 추가
        scene.add(ObjectGroup);
    }
}





addObjects('object1.png', 5); 
addObjects('object2.png', 5); 
addObjects('object3.png', 5); 
addObjects('object4.png', 5); 
addObjects('object5.png', 5); 
addObjects('object6.png', 5); 
addObjects('object7.png', 5); 