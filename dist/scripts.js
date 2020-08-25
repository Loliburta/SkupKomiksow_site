const stronaGlownaContent = document.getElementById("ZmianaContentu").innerHTML;
const kontaktContent = '<h1 class="mt-5" style="font-size: min(max(40px, 6vw), 68px); text-align: center; font-weight: bold">Kontakt:</h1><h2 class="mt-4" style="font-size: min(max(30px, 6vw), 55px); font-weight: bold">Email:</h2> <h2 class="ml-3" style="font-size: min(max(25px, 5vw), 50px)"> skupkomiksow@o2.pl</h2><h2 class="mt-4" style="font-size: min(max(30px, 6vw), 55px); font-weight: bold">Telefon: </h2><h2 class="ml-3" style="font-size: min(max(25px, 5vw), 50px)">730 450 230</h2>'

const kontakt = document.getElementById('kontaktNapis');
const stronaGlowna = document.getElementById("stronaGlownaNapis");

function zmianaNaStroneGlowna(){
    document.getElementById('ZmianaContentu').innerHTML = stronaGlownaContent;
    kontakt.classList.remove('active')
    stronaGlowna.classList.add('active')
}
stronaGlowna.addEventListener('click', zmianaNaStroneGlowna);

function zmianaNaKontakt(){
    document.getElementById('ZmianaContentu').innerHTML = kontaktContent;
    stronaGlowna.classList.remove("active");
    kontakt.classList.add('active')
}
kontakt.addEventListener('click', zmianaNaKontakt);


(function () {
    let scene,
        renderer,
        camera,
        model,
        possibleAnims,
        mixer,
        idle,
        clock = new THREE.Clock(),
        currentlyAnimating = false,
        loaderAnim = document.getElementById('js-loader');
    init();

    function init() {
        const MODEL_PATH = 'THREE/src/dwie_animacje_textury16.gltf';
        const canvas = document.querySelector('#c');

        // Init the scene
        scene = new THREE.Scene();

        // Init the renderer
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('canvas_divID').appendChild(renderer.domElement);

        // Add a camera
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 22;
        camera.position.x = -1;
        camera.position.y = -2.23;

        const loader = new THREE.GLTFLoader();
        loader.load(MODEL_PATH, function(gltf) {
            model = gltf.scene;
            const fileAnimations = gltf.animations;

            // Set the models initial scale
                model.scale.set(8, 8, 8);
                model.position.y = -11;
                scene.add(model);
                loaderAnim.remove();
                mixer = new THREE.AnimationMixer(model);
                const clips = fileAnimations.filter(val => val.name !== 'idle');
                possibleAnims = clips.map(val => {
                    let clip = THREE.AnimationClip.findByName(clips, val.name);
                    clip.tracks.splice(3, 3);
                    clip.tracks.splice(9, 3);
                    clip = mixer.clipAction(clip);
                    return clip;
                });
                let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
                idle = mixer.clipAction(idleAnim);
                idle.play();
                },
            undefined,
            function(error) {
            console.error(error);
        });
        const light = new THREE.AmbientLight(0x404040, 17.5); // white light
        scene.add( light );
        const spotLight = new THREE.SpotLight(0xFF0000, 1.8);
        spotLight.position.set(5, 10, 2);

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        scene.add( spotLight );
    }
    function update() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        if (mixer) {
          mixer.update(clock.getDelta());
        }
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    update();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const canvasPixelWidth = canvas.width / window.devicePixelRatio;
        const canvasPixelHeight = canvas.height / window.devicePixelRatio;
        const needResize =
            canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // Get a random animation, and play it
    function playOnClick() {
        const anim = Math.floor(Math.random() * possibleAnims.length);
        playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
    }
    function playModifierAnimation(from, fSpeed, to, tSpeed) {
        to.setLoop(THREE.LoopOnce);
        to.reset();
        to.play();
        from.crossFadeTo(to, fSpeed, true);
        setTimeout(function() {
            from.enabled = true;
            to.crossFadeTo(from, tSpeed, true);
            currentlyAnimating = false;
            }, to._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    }
    function playAnimation(){
        if(!currentlyAnimating){
            currentlyAnimating = true;
            playOnClick();
        }
    }
    kontakt.addEventListener('click', playAnimation);
})(); // Don't add anything below this line