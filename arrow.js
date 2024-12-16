// 5. X, Y, Z 축 표시하기 (음수 방향으로도 연장)
const axesLength = 4; // 축의 길이
const pointsCount = 20; // 곡선을 위한 점의 개수

const curves = []; // 곡선을 저장할 배열

function createDashedLine(start, end, color) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
        color: color,
        dashSize: 0.03,
        gapSize: 0.1,
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances(); // 점선 거리 계산

    return line;
}

// 곡선 생성
const xAxis = createDashedLine(new THREE.Vector3(-axesLength, 0, 0), new THREE.Vector3(axesLength, 0, 0), 0xff0000);
const yAxis = createDashedLine(new THREE.Vector3(0, -axesLength, 0), new THREE.Vector3(0, axesLength, 0), 0xAF2E3A);
const zAxis = createDashedLine(new THREE.Vector3(0, 0, -axesLength), new THREE.Vector3(0, 0, axesLength), 0xFFD78C);

// 씬에 축 추가
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);



function createRandomCurve(start, end, color) {
    const points = [];
    const randomness = 0.1; // 곡선의 랜덤 정도

    // 랜덤한 곡선 점 생성
    for (let i = 0; i < pointsCount; i++) {
        const t = i / (pointsCount - 1); // 0에서 1까지의 비율
        const x = THREE.MathUtils.lerp(start.x, end.x, t);
        const y = THREE.MathUtils.lerp(start.y, end.y, t);
        const z = THREE.MathUtils.lerp(start.z, end.z, t);

        points.push(new THREE.Vector3(
            x + (Math.random() - 0.5) * randomness,
            y + (Math.random() - 0.5) * randomness,
            z + (Math.random() - 0.5) * randomness
        ));
    }

    // 부드러운 곡선 생성
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(100); // 곡선을 부드럽게

    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);

    // 그룹 생성
    const group = new THREE.Group();
    group.add(line); // 곡선을 그룹에 추가

    return group; // 그룹 반환
}

// 화살표 생성 함수
function createArrow(start, direction, color, arrowHeadLength = 0.5, arrowHeadWidth = 0.1, group) {
    const headLength = 0.2; // 화살표 머리 길이
    const headWidth = 0.1; // 화살표 머리 너비
    const arrowHelper = new THREE.ArrowHelper(direction.clone().normalize(), start, 1, color, headLength, headWidth, group);
    group.add(arrowHelper); // 화살표를 그룹에 추가
}


// 곡선 생성
const xCurveGroup = createRandomCurve(new THREE.Vector3(-axesLength, 0, 0), new THREE.Vector3(axesLength, 0, 0), 0xff0000);
createArrow(new THREE.Vector3(axesLength, 0, 0), new THREE.Vector3(1, 0, 0), 0xff0000, 3, 0.2, xCurveGroup); // X축 끝에 화살표

const yCurveGroup = createRandomCurve(new THREE.Vector3(0, -axesLength, 0), new THREE.Vector3(0, axesLength, 0), 0xAF2E3A);
createArrow(new THREE.Vector3(0, axesLength, 0), new THREE.Vector3(0, 1, 0), 0x00ff00, 3, 0.2, yCurveGroup); // Y축 끝에 화살표

const zCurveGroup = createRandomCurve(new THREE.Vector3(0, 0, -axesLength), new THREE.Vector3(0, 0, axesLength), 0xFFD78C);
createArrow(new THREE.Vector3(0, 0, axesLength), new THREE.Vector3(0, 0, 1), 0x0000ff, 3, 0.2, zCurveGroup); // Z축 끝에 화살표



// 씬에 그룹 추가
scene.add(xCurveGroup);
scene.add(yCurveGroup);
scene.add(zCurveGroup);
