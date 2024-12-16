// 1. Scene 생성
const scene = new THREE.Scene();

// 1. HTML5 Canvas로 방사형 그라디언트 생성
function createRadialGradientBackground() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = 512;
    canvas.height = 512;

    // 방사형 그라디언트 생성
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

    // 그라디언트 색상 및 전환점 설정
    gradient.addColorStop(0, '#FFD78C'); // 중심 색상
    gradient.addColorStop(0.2, '#A4C294'); // 중심 색상
    gradient.addColorStop(0.5, '#655D5B'); // 바깥쪽 색상
    gradient.addColorStop(0.6, '#514B49'); // 바깥쪽 색상
    gradient.addColorStop(1, '#232220'); // 바깥쪽 색상

 

    // 그라디언트 채우기
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
}

// 2. Scene 배경으로 설정
const radialGradientTexture = createRadialGradientBackground();
scene.background = radialGradientTexture;



// 2. Camera 생성 (Perspective Camera)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6, 6, 6); // 카메라 위치 조정

// 3. Renderer 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.toneMapping = THREE.LinearToneMapping; // 톤 매핑 방식 설정
renderer.toneMappingExposure = 1; // 강도 조정 (값을 높이면 밝아짐)


// 4. OrbitControls 추가 (마우스로 회전/확대/이동 가능)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// 안개 생성
scene.fog = new THREE.Fog(0x72363A, 11, 12); // 안개 색상, 시작 거리, 종료 거리 설정
scene.fog = new THREE.Fog(0x72363A, 11, 12);


// 그라데이션 맵 생성 함수
function createGradientMap() {
    const size = 30;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 1;

    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, size, 0);


    gradient.addColorStop(0, '#FFD78C');    // 시작: 밝은 노란색
    gradient.addColorStop(0.25, '#FF9F6E'); // 중간: 부드러운 주황색
    gradient.addColorStop(0.5, '#A4C294'); // 중간: 녹색 계열
    gradient.addColorStop(0.75, '#72363A'); // 중간: 어두운 빨강
    gradient.addColorStop(1, '#3D1A1C');    // 끝: 매우 어두운 빨강

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return texture;
}


// 7. 점 추가 함수 (토온 쉐이딩 및 트랜지션 애니메이션 추가)

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
                intensity = pow(0.4 - dot(vNormal, vNormel), 5.0);
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

    const colors = [0xFFD78C, 0xA4C294, 0x72363A, 0x655D5B, 0x232220];
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // 랜덤으로 하나 선택



    const selectedTexture = textures[textureIndex - 1];
    const gradientMap = createGradientMap();

    const geometry = new THREE.SphereGeometry(size / 10, 32, 32);
    const material = new THREE.MeshToonMaterial({ 
        color: new THREE.Color(randomColor),
        map: selectedTexture,
        gradientMap: gradientMap
    });

    const point = new THREE.Mesh(geometry, material);
    point.position.set(x, y, z);
    point.scale.set(0, 0, 0); // 점이 처음 생성될 때 크기가 0에서 시작


// 후광 생성
const glowpoint = new THREE.Mesh(
    new THREE.SphereGeometry(size / 10, 32, 32),
    createGlowMaterial(0xFFD78C) // 후광 색상
);
glowpoint.scale.set(1.1, 1.1, 1.1); // 점보다 약간 더 크게
point.add(glowpoint); // glowpoint를 point에 추가


// 점을 scene에 추가
scene.add(point);



    
    const cubeGeometry = new THREE.BoxGeometry(size / 1, size / 1, size / 1);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: new THREE.Color(`#FFD78C`),
        opacity: 1, 
        transparent: true 
    });
    const cubeEdges = new THREE.LineSegments(edges, lineMaterial);
    cubeEdges.position.set(x, y, z);
    scene.add(cubeEdges);


    const linesGroup = new THREE.Group();

    for (let i = 0; i < 16; i++) {
        const start = new THREE.Vector3(0, 0, 0);
        const xScale = 0.2;
        const yScale = 0.2;
        const zScale = 0.2;
    
        const end = new THREE.Vector3(
            Math.cos((i / 16) * Math.PI * 2) * size * xScale,
            Math.sin((i / 16) * Math.PI * 2) * size * yScale,
            (Math.random() - 0.5) * size * zScale
        );
    
        // 선을 CylinderGeometry로 생성
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const cylinderGeometry = new THREE.CylinderGeometry(0.01, 0.03, length, 2); // 0.05는 선 두께
        const cylinderMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(`FFD78C`),
            transparent: true,
            opacity: 1,
        });
    
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    
        // 방향 맞추기
        cylinder.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0), // Cylinder 기본 방향
            direction.clone().normalize()
        );
    
        // 위치 설정
        cylinder.position.copy(start).add(direction.multiplyScalar(0.5));
        linesGroup.add(cylinder);
    }
    
    linesGroup.position.set(x, y, z);
    scene.add(linesGroup);
    
    function animateGlow() {
        let glowDuration = 1000;
        let glowStep = 0;
    
        function animateGlowStep() {
            if (glowStep < glowDuration) {
                const t = glowStep / glowDuration;
                cubeEdges.scale.set(point.scale.x * (1 - t), point.scale.y * (1 - t), point.scale.z * (1 - t));
                linesGroup.scale.set(point.scale.x * (1 - t), point.scale.y * (1 - t), point.scale.z * (1 - t));
                glowStep++;
                requestAnimationFrame(animateGlowStep);
            } else {
                scene.remove(cubeEdges); // 큐브 제거
                scene.remove(linesGroup);
                animateRotation(); // 회전 애니메이션 시작
            }
        }
    
        animateGlowStep();
    }


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



    function animateRotation() {
        point.rotation.x += Math.random() * 0.01 + 0.01; // -0.05 ~ 0.05 범위
        point.rotation.y += Math.random() * 0.01 + 0.01; // -0.05 ~ 0.05 범위
        point.rotation.z += Math.random() * 0.01 + 0.01; // -0.05 ~ 0.05 범위
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
const SHEET_API_URL = 'https://api.sheetbest.com/sheets/6d15742d-ba8e-4663-b64e-8364415bedf0'; // Sheet.best에서 받은 URL로 교체







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

let initialCameraRestriction = true; // 초기 30초 동안 제한
let isCameraMoving = false; // 현재 카메라가 특정 점으로 이동 중인지 확인

// 초기화 시 30초 후 제한 해제
setTimeout(() => {
    initialCameraRestriction = false;
}, 30000);

// 카메라 이동 함수
function moveCameraToPoint(point) {
    if (initialCameraRestriction || isCameraMoving) return;

    isCameraMoving = true;

    // 카메라 위치 계산 및 이동
    const duration = 10000; // 5초간 이동
    const targetPosition = new THREE.Vector3(point.x, point.y, point.z + 5); // 타겟 포지션

    const startPosition = camera.position.clone();
    const startTime = Date.now();

    function animateCamera() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(startPosition, targetPosition, t);
        camera.lookAt(point); // 점을 바라보도록 설정

        if (t < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            setTimeout(() => {
                isCameraMoving = false; // 5초 후 원래 회전 동작 복원
            }, 10000); // 5초 대기 후
        }
    }

    animateCamera();
}


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

 const time = Date.now() * 0.0003; // 시간에 따라 변화

	// 목표 위치를 시간에 따라 계산
	targetPosition.x = radius * Math.sin(time) * 0.1; // X축 회전 * 0.02, 0.6 를 넣으면 다이나믹해짐
	targetPosition.y = radius * Math.sin(time) * 0.7; // Y축 회전 (속도 다르게)
	targetPosition.z = radius * Math.cos(time) * 0.3; // Z축 회전

	// 카메라의 현재 위치를 목표 위치로 부드럽게 보간
	currentPosition.lerp(targetPosition, lerpSpeed);
	camera.position.copy(currentPosition);

	// 카메라가 원점(0, 0, 0)을 계속 바라보도록 설정
	camera.lookAt(0, 0, 0);

	// 동적 조명 업데이트
	const timer = Date.now() * 0.0003;
	
	// 첫 번째 조명
	particleLight1.position.x = Math.sin(timer * 1) * 100;
	particleLight1.position.y = Math.cos(timer * 1) * 200;
	particleLight1.position.z = Math.cos(timer * 3) * 300;

	// 두 번째 조명 (다른 속도와 방향)
	particleLight2.position.x = Math.cos(timer * 2) * 150;
	particleLight2.position.y = Math.sin(timer * 1.5) * 250;
	particleLight2.position.z = Math.sin(timer * 2) * 200;

	// 세 번째 조명 (또 다른 속도와 방향)
	particleLight3.position.x = Math.sin(timer * 1.5) * 200;
	particleLight3.position.y = Math.cos(timer * 2.5) * 150;
	particleLight3.position.z = Math.sin(timer * 1) * 250;

	controls.update(); // 마우스 컨트롤 업데이트
	renderer.render(scene, camera);
}

        
// 애니메이션 시작
animate();


