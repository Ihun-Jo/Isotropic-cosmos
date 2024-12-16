function createNebula() {
    const nebulaGroup = new THREE.Group();

    // 곡선을 구성할 주요 포인트 생성
    const nebulaPoints = [];
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        nebulaPoints.push(new THREE.Vector3(x, y, z));
    }

    // 구불구불한 곡선 생성
    const curve = new THREE.CatmullRomCurve3(nebulaPoints, true);

    // 곡선을 따라 점 생성
    const curvePoints = curve.getPoints(2000);
    const geometry = new THREE.OctahedronGeometry(0.02);

    // 색상 배열 정의
    const colors = [
        new THREE.Color(0xFFD78C), // FFD78C
        new THREE.Color(0xA4C294),
        new THREE.Color(0xD3663A), // A4C294
        new THREE.Color(0x72363A)  // 72363A


        
    ];

    for (let i = 0; i < curvePoints.length; i++) {
        // 색상 배열을 순환하며 적용
        const color = colors[i % colors.length];

        const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.7 });
        const star = new THREE.Mesh(geometry, material);

        // 곡선 위의 포지션에 약간의 랜덤 오프셋 추가
        const randomOffset = new THREE.Vector3(
            (Math.random() - 0.5) * 3, 
            (Math.random() - 0.5) * 0.7, 
            (Math.random() - 0.5) * 2  
        );

        star.position.copy(curvePoints[i]).add(randomOffset);

        // 점을 성운 그룹에 추가
        nebulaGroup.add(star);
    }

    scene.add(nebulaGroup); // 성운 그룹을 씬에 추가
}

// 성운 생성
createNebula();
