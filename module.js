import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Scene 생성
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000030); // 파란 배경

// 2. Camera 생성 (Perspective Camera)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6, 6, 6); // 카메라 위치 조정

// 3. Renderer 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. OrbitControls 추가 (마우스로 회전/확대/이동 가능)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

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
const yAxis = createDashedLine(new THREE.Vector3(0, -axesLength, 0), new THREE.Vector3(0, axesLength, 0), 0x00ff00);
const zAxis = createDashedLine(new THREE.Vector3(0, 0, -axesLength), new THREE.Vector3(0, 0, axesLength), 0xffffff);

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

const yCurveGroup = createRandomCurve(new THREE.Vector3(0, -axesLength, 0), new THREE.Vector3(0, axesLength, 0), 0x00ff00);
createArrow(new THREE.Vector3(0, axesLength, 0), new THREE.Vector3(0, 1, 0), 0x00ff00, 3, 0.2, yCurveGroup); // Y축 끝에 화살표

const zCurveGroup = createRandomCurve(new THREE.Vector3(0, 0, -axesLength), new THREE.Vector3(0, 0, axesLength), 0xffffff);
createArrow(new THREE.Vector3(0, 0, axesLength), new THREE.Vector3(0, 0, 1), 0x0000ff, 3, 0.2, zCurveGroup); // Z축 끝에 화살표



// 씬에 그룹 추가
scene.add(xCurveGroup);
scene.add(yCurveGroup);
scene.add(zCurveGroup);


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
    const curvePoints = curve.getPoints(500);
    const geometry = new THREE.OctahedronGeometry(0.02);

    for (let i = 0; i < curvePoints.length; i++) {
        // 곡선의 진행 비율을 사용하여 색상을 그라디언트처럼 설정
        const t = i / curvePoints.length;
        const color = new THREE.Color();
        color.setHSL(t, 0.8, 0.5); // HSL을 사용해 그라디언트 색상 설정

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

// 안개 생성
scene.fog = new THREE.Fog(0xFF6600, 9, 10); // 안개 색상, 시작 거리, 종료 거리 설정


// 6. Light 추가 및 Toon Shading을 위한 추가 조명 설정
function addLighting() {
    // 기존 Directional Light
    const directionalLight = new THREE.DirectionalLight(0x0000ff, 5);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Ambient Light 추가
    const ambientLight = new THREE.AmbientLight(0x404040, 4); // 부드러운 흰색 빛
    scene.add(ambientLight);

    // Point Light (동적 조명)
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry(4, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    scene.add(particleLight);

    const pointLight = new THREE.PointLight(0xffffff, 8, 800, 6);
    particleLight.add(pointLight);
}


// 그라데이션 맵 생성 함수
function createGradientMap() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 1;

    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, size, 0);
    
   gradient.addColorStop(0, 'blue');    // 시작 색상
    gradient.addColorStop(0.5, 'black'); // 중간 색상 (검정)
    gradient.addColorStop(1, 'red'); 

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return texture;
}


// 7. 점 추가 함수 (토온 쉐이딩 및 트랜지션 애니메이션 추가)
const textures = [
    new THREE.TextureLoader().load('texture1.png' ,(texture) => {
        texture.needsUpdate = true;
    }),
    new THREE.TextureLoader().load('texture2.png' ,(texture) => {
        texture.needsUpdate = true;
    }),
    new THREE.TextureLoader().load('texture3.png' ,(texture) => {
        texture.needsUpdate = true;
    }),
    new THREE.TextureLoader().load('texture4.png' ,(texture) => {
        texture.needsUpdate = true;
    }),
    new THREE.TextureLoader().load('texture5.png' ,(texture) => {
        texture.needsUpdate = true;
    }),
    new THREE.TextureLoader().load('texture6.png' ,(texture) => {
        texture.needsUpdate = true;
    })
];



function addPoint(x, y, z, size, r, g, b, textureIndex) {
    const selectedTexture = textures[textureIndex - 1];
    const gradientMap = createGradientMap();

    const geometry = new THREE.SphereGeometry(size / 15, 16, 16);
    const material = new THREE.MeshToonMaterial({ 
        color: new THREE.Color(`rgb(${r}, ${g}, ${b})`),
        map: selectedTexture,
        gradientMap: gradientMap
    });

    const point = new THREE.Mesh(geometry, material);
    point.position.set(x, y, z);
    point.scale.set(0, 0, 0);
    scene.add(point);

    const cubeGeometry = new THREE.BoxGeometry(size / 2, size / 2, size / 2);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: new THREE.Color(`rgb(${r}, ${g}, ${b})`),
        opacity: 1, 
        transparent: true 
    });
    const cubeEdges = new THREE.LineSegments(edges, lineMaterial);
    cubeEdges.position.set(x, y, z);
    scene.add(cubeEdges);

    const animationDuration = 1000;
    const animationSteps = 60;
    const scaleStep = (size / 10) / animationSteps;
    let step = 0;

    function animatePoint() {
        if (step < animationSteps) {
            point.scale.x += scaleStep;
            point.scale.y += scaleStep;
            point.scale.z += scaleStep;
            cubeEdges.scale.set(point.scale.x, point.scale.y, point.scale.z);
            step++;
            requestAnimationFrame(animatePoint);
        } else {
            setTimeout(() => {
                animateGlow();
            }, 500);
        }
    }

    function animateGlow() {
        let glowDuration = 30;
        let glowStep = 0;

        function animateGlowStep() {
            if (glowStep < glowDuration) {
                const t = glowStep / glowDuration;
                cubeEdges.scale.set(point.scale.x * (1 - t), point.scale.y * (1 - t), point.scale.z * (1 - t));
                glowStep++;
                requestAnimationFrame(animateGlowStep);
            } else {
                scene.remove(cubeEdges);
                animateRotation();
            }
        }

        animateGlowStep();
    }

    function animateRotation() {
        point.rotation.y += 0.02;
        point.rotation.x += 0.02;
        requestAnimationFrame(animateRotation);
    }

    animatePoint();
    return point;
}



// 8. 윈도우 리사이즈 대응
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// 현재 씬에 추가된 점을 추적하기 위한 Map (ID를 키로 사용)
const pointsMap = new Map();

// Google Sheets API 엔드포인트
const SHEET_API_URL = 'https://api.sheetbest.com/sheets/ea0f7bc1-e7eb-4e72-9a05-450906c77f66'; // Sheet.best에서 받은 URL로 교체


// 스타 이미지를 추가하는 함수
function addStars(imageUrl, count) {
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load(imageUrl);

    for (let i = 0; i < count; i++) {
        // 랜덤한 위치 생성
        const x = Math.random() * 20 - 10; 
        const y = Math.random() * 20 - 10; 
        const z = Math.random() * 20 - 10; 

        const size = Math.random() * 0.3 + 0.1;

        // ShaderMaterial을 사용한 glow 효과 추가
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "c": { type: "f", value: 1.0 }, // glow 강도
                "p": { type: "f", value: 9.0 }, // glow 확산 정도
                glowColor: { type: "c", value: new THREE.Color(0xffffff) },
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

        const glow = new THREE.Mesh(new THREE.SphereGeometry(size * 0.5, 16, 16), glowMaterial);
        glow.position.set(x, y, z);

        // 별과 glow를 그룹화
        const starGroup = new THREE.Group();
        starGroup.add(star);
        starGroup.add(glow);

        // 씬에 추가
        scene.add(starGroup);
    }
}


// 페이지 로드 시 조명 추가
addLighting();

// 스타 이미지 추가
addStars('star.png', 40); // star.png를 20개 추가

// 이후 fetchAndUpdatePoints 함수는 랜덤 점 생성 없이 데이터 업데이트만 수행
async function fetchAndUpdatePoints() {
    try {
        updateStatus.innerText = '데이터 가져오는 중...';
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();


        // ID 기준으로 내림차순 정렬
        data.sort((a, b) => b.ID - a.ID);

        // 최근 50개 데이터만 가져오기
        const recentData = data.slice(0, 200);
        const newIDs = new Set();

        recentData.forEach(row => {
            const id = row.ID;
            newIDs.add(id);


            if (!pointsMap.has(id)) {
                const x = parseFloat(row.q1);
                const y = parseFloat(row.q2);
                const z = parseFloat(row.q3);
                const size = parseFloat(row.q5);
                const r = parseInt(row.q4_1);
                const g = parseInt(row.q4_2);
                const b = parseInt(row.q4_3);
                const textureIndex = parseInt(row.q6);

                const point = addPoint(x, y, z, size, r, g, b, textureIndex);
                pointsMap.set(id, point); // 새 점을 pointsMap에 추가
            }
        });

        // 씬에서 제거할 점 처리
        pointsMap.forEach((point, id) => {
            if (!newIDs.has(id)) {
                scene.remove(point);
                pointsMap.delete(id); // 제거된 점을 pointsMap에서 삭제
            }
        });

        updateStatus.innerText = '데이터 업데이트 완료!';

        console.log("현재 화면에 표시된 점 데이터:");
        pointsMap.forEach((point, id) => {
            console.log(`ID: ${id}, Position: (${point.position.x}, ${point.position.y}, ${point.position.z})`);
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
        updateStatus.innerText = '데이터 가져오기 실패!';
    }
}

// 주기적으로 데이터 가져오기
setInterval(fetchAndUpdatePoints, 5000); // 5초마다 업데이트

// 10. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

        // 각각 다른 방향으로 곡선 회전
        xCurveGroup.rotation.y += 0.04; // X축에 해당하는 곡선은 Y축으로 회전
        yCurveGroup.rotation.z += 0.02; // Y축에 해당하는 곡선은 X축으로 회전
        zCurveGroup.rotation.x += 0.01; // Z축에 해당하는 곡선은 Z축으로 회전
       
   
	// 회전 반경
	const radius = 8;

	// 목표 카메라 위치를 저장하는 벡터
	let targetPosition = new THREE.Vector3();

	// 카메라의 현재 위치를 저장하는 벡터
	let currentPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

	// 부드럽게 카메라 위치를 보간하기 위한 속도
	const lerpSpeed = 0.05;

	const time = Date.now() * 0.0006; // 시간에 따라 변화

	// 목표 위치를 시간에 따라 계산
	targetPosition.x = radius * Math.sin(time) * 0.1; // X축 회전 * 0.02, 0.6 를 넣으면 다이나믹해짐
	targetPosition.y = radius * Math.sin(time) * 0.5; // Y축 회전 (속도 다르게)
	targetPosition.z = radius * Math.cos(time) * 0.3; // Z축 회전

	// 카메라의 현재 위치를 목표 위치로 부드럽게 보간
	currentPosition.lerp(targetPosition, lerpSpeed);
	camera.position.copy(currentPosition);

	// 카메라가 원점(0, 0, 0)을 계속 바라보도록 설정
	camera.lookAt(0, 0, 0);

	// 동적 조명 업데이트
	const timer = Date.now() * 0.0003;
	particleLight.position.x = Math.sin(timer * 1) * 100;
	particleLight.position.y = Math.cos(timer * 1) * 200;
	particleLight.position.z = Math.cos(timer * 3) * 300;

	controls.update(); // 마우스 컨트롤 업데이트
	renderer.render(scene, camera);
}

        
// 애니메이션 시작
animate();
