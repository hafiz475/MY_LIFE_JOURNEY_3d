import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import ParticleEffect from './ParticleEffect';
import LaptopScene from './LaptopScene';
import '../styles/room-scene.scss';

// Football t-shirt content
const footballContent = {
    title: "Football Passion",
    subtitle: "The Beautiful Game",
    storyPoints: [
        "District-level player — the Messi of my small town",
        "Weekend matches with friends on dusty grounds",
        "The pitch has always been my second home"
    ],
    cards: [
        {
            icon: "/assets/2dModels/football_img.png",
            title: "Weekend Warrior",
            description: "Every weekend, the local pitch becomes my battlefield. Rain or shine, the game must go on."
        },
        {
            icon: "/assets/2dModels/chess_img.png",
            title: "Tactical Mind",
            description: "Reading the game, anticipating moves, and finding that perfect through ball. Football is chess at 100 km/h."
        },
        {
            icon: "/assets/2dModels/heart_img.png",
            title: "Pure Passion",
            description: "From watching legends on TV to playing under streetlights. This love never fades."
        },
        {
            icon: "/assets/2dModels/trophy_img.png",
            title: "Team Leader",
            description: "Captain spirit runs deep. Leading by example, lifting the team when spirits are low."
        }
    ]
};

// Royal Enfield content - My Real Story
const royalEnfieldContent = {
    title: "Royal Enfield Era",
    subtitle: "Kaizen, Torque & 2,000 Bullets a Day",
    storyPoints: [
        "B.E. Mechanical Engineering → Robotics & Mechatronics",
        "Kaizen Coordinator + Vehicle Assembly Supervisor",
        "Coordinated with 500+ engineers daily",
        "2,000 motorcycles rolled out every single day",
        "'Torque it properly, macha!' — 17 times per shift 😄"
    ],
    cards: [
        {
            icon: "🏭",
            title: "Production Floor",
            description: "Supervising 2,000 motorcycles daily. Every bolt tightened, every engine tested — zero compromises."
        },
        {
            icon: "/assets/2dModels/kaizen_master.png",
            title: "Kaizen Master",
            description: "Continuous improvement wasn't just a buzzword. It was hunting inefficiencies and making processes bulletproof."
        },
        {
            icon: "/assets/2dModels/mechanical_engineer.png",
            title: "500+ Engineers",
            description: "Coordinating with a massive team across shifts. Communication, leadership, and keeping the line moving."
        },
        {
            icon: "⚡",
            title: "The Pivot",
            description: "Industry 4.0 hit the factory — robots, IoT, data everywhere. That's when I knew: time to learn code."
        }
    ]
};

// Blender Creative Artist content
const blenderContent = {
    title: "Creative Artist",
    subtitle: "3D Artistry with Blender",
    level: "Intermediate",
    storyPoints: [
        "Bone rigging & character animation",
        "Sculpting organic forms",
        "UV unwrapping & texture mapping",
        "Scene lighting & composition",
        "Camera animation & cinematics",
        "Eevee & Cycles rendering"
    ],
    // Project cards linking to existing routes
    projects: [
        {
            title: "Software Craft",
            route: "/software",
            description: "3D Laptop Scene with interactive animations and lighting effects",
            tag: "Animation & Interactivity",
            icon: "💻"
        },
        {
            title: "Career Journey",
            route: "/softwareCareer",
            description: "Immersive room environment with dynamic day/night lighting",
            tag: "Lighting & Environment",
            icon: "🏠"
        },
        {
            title: "ASUS ROG",
            route: "/asus",
            description: "Laptop lid animation with bone rigging and smooth motion",
            tag: "Rigging & Motion",
            icon: "🎮"
        },
        {
            title: "Poly Theme Island",
            route: "/polyTheme",
            description: "Complete windmill scene with water, clouds, and wildlife",
            tag: "Complete Scene",
            icon: "🏝️"
        }
    ],
    // Starter kit downloads
    starterKits: [
        {
            name: "HD Chess Kit",
            description: "High-detail chess pieces and board",
            files: [
                "/assets/blender/Chess/HD chess/Chess board.blend",
                "/assets/blender/Chess/HD chess/Chess base piece.blend"
            ],
            icon: "♔"
        },
        {
            name: "Low Poly Chess",
            description: "Full set of low-poly optimized chess pieces",
            files: [
                "/assets/blender/Chess/Low poly chess/Chess board full set 2( color )- Copy.blend",
                "/assets/blender/Chess/Low poly chess/Chess board full set 2- Copy.blend",
                "/assets/blender/Chess/Low poly chess/LP King.blend",
                "/assets/blender/Chess/Low poly chess/LP Queen.blend",
                "/assets/blender/Chess/Low poly chess/LP Knight.blend",
                "/assets/blender/Chess/Low poly chess/Chess Bishop.blend",
                "/assets/blender/Chess/Low poly chess/LP rook.blend",
                "/assets/blender/Chess/Low poly chess/Chess Pawn.blend"
            ],
            icon: "♙"
        },
        {
            name: "Donut Tutorial",
            description: "Classic Blender donut - 3 variations",
            files: [
                "/assets/blender/Donut/donut.blend",
                "/assets/blender/Donut/donut 1.blend",
                "/assets/blender/Donut/Donut 2.blend"
            ],
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></svg>
        },
        {
            name: "Fluffy Bunny",
            description: "Sculpted character with fur shader",
            files: ["/assets/blender/Fluffy bunny/untitled.blend"],
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 5L8 2M14 5L16 2M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" /><path d="M9 12H9.01M15 12H15.01" /><path d="M10 16C10.5 17 13.5 17 14 16" /></svg>
        },
        {
            name: "Lamp Animation",
            description: "Rigged lamp with animation",
            files: ["/assets/blender/Lamp/Lamp.blend1"],
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5V2M12 22V19M5 12H2M22 12H19M7.05 7.05L4.93 4.93M19.07 19.07L16.95 16.83M19.07 4.93L16.95 7.05M7.05 19.07L4.93 16.95M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" /></svg>
        }
    ],
    // Showcase gallery - now will be displayed as carousel
    gallery: [
        { src: "/assets/blender/Chess cycle 2.png", title: "Chess Set - Cycles Render" },
        { src: "/assets/blender/Chess Eevee 1.png", title: "Chess Set - Eevee Render" },
        { src: "/assets/blender/Chess/Low poly chess/Full chess 1.png", title: "Low Poly Chess Set" },
        { src: "/assets/blender/finished well part 1.png", title: "Stone Well - Part 1" },
        { src: "/assets/blender/finished well part 2(cycle rendered).png", title: "Stone Well - Cycles" },
        { src: "/assets/blender/oil barell render.png", title: "Oil Barrel" },
        { src: "/assets/blender/rocket cycle render.png", title: "Rocket - Cycles Render" }
    ]
};

// Software content
const softwareContent = {
    title: "Software Engineering",
    subtitle: "Crafting Digital Experiences",
    description: "From frontend magic to backend architecture, I build robust and scalable applications that solve real-world problems.",
    skills: [
        { name: "React", level: "Expert" },
        { name: "Node.js", level: "Advanced" },
        { name: "TypeScript", level: "Expert" },
        { name: "MongoDB", level: "Advanced" },
        { name: "Three.js", level: "Intermediate" },
        { name: "Next.js", level: "Advanced" }
    ],
    projects: [
        "Built enterprise chat applications",
        "Created 3D portfolio experiences",
        "Developed CRM integrations",
        "Automated workflow systems"
    ]
};

// Full Stack Developer content
const fullStackContent = {
    title: "Full Stack Developer",
    subtitle: "MERN Stack & Cloud Architecture",
    headerIcon: "/assets/lotties/space boy developer (1).json",
    storyPoints: [
        "Specialized in MERN stack development with 4+ years of experience",
        "Cloud orchestration using AWS, DigitalOcean & Cloudflare",
        "Security expert: Firebase 2FA, OTP verification & Secure Auth",
        "Building scalable microservices with Node.js & Express"
    ],
    skills: [
        { name: "React", lottie: "/assets/lotties/react.json", color: "#61DAFB" },
        { name: "Node.js", lottie: "/assets/lotties/node.json", color: "#339933" },
        { name: "MongoDB", lottie: "/assets/lotties/mongodb.json", color: "#47A248" },
        { name: "Express", lottie: "/assets/lotties/express.json", color: "#000000" },
        { name: "TypeScript", lottie: "/assets/lotties/typescript.json", color: "#3178C6" },
        { name: "JavaScript", lottie: "/assets/lotties/javascript.json", color: "#F7DF1E" },
        { name: "Next.js", lottie: "/assets/lotties/nextjs.json", color: "#ffffff" },
        { name: "AWS", lottie: "/assets/lotties/aws.json", color: "#FF9900" },
        { name: "DigitalOcean", lottie: "/assets/lotties/digitalocean.json", color: "#0080FF" },
        { name: "Cloudflare", lottie: "/assets/lotties/cloudflare.json", color: "#F38020" },
        { name: "Firebase", lottie: "/assets/lotties/firebase.json", color: "#FFCA28" }
    ],
    projects: [
        {
            title: "Parallax Seaview",
            link: "https://hafiz475.github.io/Parallax_Seaview/",
            description: "A stunning 2D parallax experience of the sea",
            tag: "2D Parallax",
            icon: "🌊"
        },
        {
            title: "My 2D Resume",
            link: "https://hafiz475.github.io/my_2d_resume/",
            description: "Interactive 2D resume with smooth transitions",
            tag: "Interactive UI",
            icon: "📄"
        },
        {
            title: "Project Mark 47",
            link: "https://hafiz475.github.io/project_mark47/",
            description: "Advanced web project with complex logic",
            tag: "Full Stack",
            icon: "🦾"
        },
        {
            title: "3D WebGL Learning",
            link: "https://hafiz475.github.io/3d_learning_webGl/",
            description: "Exploring the world of 3D graphics on the web",
            tag: "WebGL & 3D",
            icon: "🎮"
        }
    ],
    projects3D: [
        {
            title: "Software Craft",
            route: "/software",
            description: "3D Laptop Scene with interactive animations and lighting effects",
            tag: "Animation & Interactivity",
            icon: "💻"
        },
        {
            title: "Career Journey",
            route: "/softwareCareer",
            description: "Immersive room environment with dynamic day/night lighting",
            tag: "Lighting & Environment",
            icon: "🏠"
        },
        {
            title: "ASUS ROG",
            route: "/asus",
            description: "Laptop lid animation with bone rigging and smooth motion",
            tag: "Rigging & Motion",
            icon: "🎮"
        },
        {
            title: "Poly Theme Island",
            route: "/polyTheme",
            description: "Complete windmill scene with water, clouds, and wildlife",
            tag: "Complete Scene",
            icon: "🏝️"
        }
    ],
    games: [
        {
            title: "Pinball",
            route: "/pinball",
            description: "Retro pinball game experience",
            icon: "🥎"
        },
        {
            title: "Flappy Bird",
            route: "/flappy-bird",
            description: "Classic flappy bird with a twist",
            icon: "🐦"
        },
        {
            title: "Rubik's Cube",
            route: "/rubiks-cube",
            description: "Interactive 3D Rubik's cube solver",
            icon: "🧊"
        }
    ]
};

// Software scene component - now uses 3D Laptop
function SoftwareScene({ onBack }) {
    return (
        <div className={`software-cockpit visible`}>
            {/* Back button */}
            <button className="back-to-room" onClick={onBack}>
                <span>← Back to Interests</span>
            </button>

            {/* 3D Laptop Scene */}
            <LaptopScene />
        </div>
    );
}

// Skill Card for Full Stack Section - Optimized with memo and canvas renderer
const SkillCard = React.memo(({ skill, onLoaded }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        if (!skill.lottie) return;
        let isMounted = true;
        fetch(skill.lottie)
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setAnimationData(data);
                    if (onLoaded) onLoaded();
                }
            })
            .catch(err => {
                console.error(`Error loading lottie ${skill.name}:`, err);
                if (onLoaded) onLoaded();
            });
        return () => { isMounted = false; };
    }, [skill.lottie]);

    return (
        <div className="skill-card-mern" style={{ '--accent-color': skill.color }}>
            <div className="lottie-container">
                {animationData && (
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        renderer="canvas"
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </div>
            <span className="skill-name">{skill.name}</span>
        </div>
    );
});

// Header Icon for Full Stack Section
const FullStackHeaderIcon = React.memo(({ src, onLoaded }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        if (!src) return;
        let isMounted = true;
        fetch(src)
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setAnimationData(data);
                    if (onLoaded) onLoaded();
                }
            })
            .catch(err => {
                console.error("Error loading header lottie:", err);
                if (onLoaded) onLoaded();
            });
        return () => { isMounted = false; };
    }, [src]);

    return (
        <div className="fullstack-header-icon">
            {animationData && (
                <Lottie
                    animationData={animationData}
                    loop={true}
                    renderer="canvas"
                />
            )}
        </div>
    );
});

export default function RoomScene({ onBack }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedShirt, setSelectedShirt] = useState('football');
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [activeBlenderProjectIndex, setActiveBlenderProjectIndex] = useState(0);
    const [activeFullStackProjectIndex, setActiveFullStackProjectIndex] = useState(0);
    const [activeFullStack3DProjectIndex, setActiveFullStack3DProjectIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fullStackLoadedCount, setFullStackLoadedCount] = useState(0);
    const [isSectionReady, setIsSectionReady] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Check if we're on the /software route
    const showSoftware = location.pathname === '/software';

    // Reset indices when shirt changes
    useEffect(() => {
        setActiveCardIndex(0);
        setActiveGalleryIndex(0);
        setActiveBlenderProjectIndex(0);
        setActiveFullStackProjectIndex(0);
        setActiveFullStack3DProjectIndex(0);
        setFullStackLoadedCount(0);
        setIsSectionReady(false);

        // For non-fullstack sections, show loader briefly for a uniform experience
        if (selectedShirt !== 'fullstack') {
            const timer = setTimeout(() => setIsSectionReady(true), 800);
            return () => clearTimeout(timer);
        }
    }, [selectedShirt]);

    // Handle Full Stack loading progress
    useEffect(() => {
        if (selectedShirt === 'fullstack') {
            const totalToLoad = fullStackContent.skills.length + 1; // skills + header icon
            if (fullStackLoadedCount >= totalToLoad) {
                setTimeout(() => setIsSectionReady(true), 500);
            }
        }
    }, [fullStackLoadedCount, selectedShirt]);

    const handleLottieLoaded = () => {
        setFullStackLoadedCount(prev => prev + 1);
    };

    // Fade in content after mount
    useEffect(() => {
        const timer = setTimeout(() => setIsContentVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    // Handle software transition - navigate to /software route
    const handleEnterSoftware = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/software');
        }, 800);
    };

    // Handle back from software - navigate to /room route
    const handleBackFromSoftware = () => {
        setIsTransitioning(false);
        navigate('/room');
    };

    const currentContent = selectedShirt === 'football'
        ? footballContent
        : selectedShirt === 'enfield'
            ? royalEnfieldContent
            : selectedShirt === 'blender'
                ? blenderContent
                : fullStackContent;

    // Show software scene if on /software route
    return (
        <>
            {showSoftware ? (
                <SoftwareScene onBack={handleBackFromSoftware} />
            ) : (
                <div className={`room-scene-wrapper ${selectedShirt} ${isTransitioning ? 'fade-out' : ''} ${selectedImage ? 'modal-open' : ''}`}>
                    {/* Back Button */}
                    <button className="back-button" onClick={onBack}>
                        <span className="back-icon">🚀</span>
                        <span>Back to Sky</span>
                    </button>

                    {/* Main Content Area */}
                    <div className={`room-content ${isContentVisible ? 'visible' : ''}`}>
                        {/* T-Shirts Display */}
                        <div className="tshirts-wall">
                            {[
                                { id: 'football', label: 'Football', img: '/assets/2dModels/football_tshirt.png', alt: 'Football Jersey' },
                                { id: 'enfield', label: 'Mechanical Engineer', img: '/assets/2dModels/RE_tshirt.png', alt: 'Royal Enfield' },
                                { id: 'blender', label: 'Creative Artist', img: '/assets/2dModels/blender_tshirt.png', alt: 'Blender 3D' },
                                { id: 'fullstack', label: 'Computer Science Engineer', img: '/assets/2dModels/software_tshirt.png', alt: 'Full Stack Developer' }
                            ].map((shirt, index) => {
                                const shirtIds = ['football', 'enfield', 'blender', 'fullstack'];
                                const activeIndex = shirtIds.indexOf(selectedShirt);
                                const position = index - activeIndex;
                                let positionClass = '';

                                if (position === 0) positionClass = 'active';
                                else if (position === -1) positionClass = 'prev';
                                else if (position === 1) positionClass = 'next';
                                else if (position < -1) positionClass = 'prev-hidden';
                                else positionClass = 'next-hidden';

                                return (
                                    <div
                                        key={shirt.id}
                                        className={`tshirt-item ${positionClass}`}
                                        onClick={() => setSelectedShirt(shirt.id)}
                                    >
                                        <div className="hanger"></div>
                                        <div className="tshirt-image-wrapper">
                                            <img
                                                src={shirt.img}
                                                alt={shirt.alt}
                                                className="tshirt-image"
                                            />
                                        </div>
                                        <span className="tshirt-label">{shirt.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Content Display */}
                        <div className={`passion-display ${selectedShirt} ${isSectionReady ? 'ready' : 'loading'}`}>
                            {!isSectionReady && (
                                <div className="section-loader">
                                    <div className="loader-orbit">
                                        <div className="loader-planet"></div>
                                    </div>
                                    <p className="loader-text">
                                        {selectedShirt === 'fullstack' ? 'Initializing Full Stack Environment...' :
                                            selectedShirt === 'blender' ? 'Launching Blender Workspace...' :
                                                selectedShirt === 'enfield' ? 'Starting Engines...' :
                                                    'Preparing Pitch...'}
                                    </p>
                                </div>
                            )}

                            <h2 className="passion-title">{currentContent.title}</h2>
                            <h3 className="passion-subtitle">{currentContent.subtitle}</h3>
                            {selectedShirt === 'blender' && currentContent.level && (
                                <span className="skill-level">{currentContent.level}</span>
                            )}

                            {/* Story Points / Skills - Timeline Style */}
                            <div className="story-points">
                                {currentContent.storyPoints.map((point, index) => (
                                    <div key={index} className="story-point" style={{ animationDelay: `${0.5 + index * 0.15}s` }}>
                                        <span className="point-marker">▹</span>
                                        <span className="point-text">{point}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Blender-specific content */}
                            {selectedShirt === 'blender' ? (
                                <div className="blender-content-reveal">
                                    {/* Projects Section */}
                                    <div className="blender-section projects-section">
                                        <h4 className="section-title">🎬 3D Projects</h4>
                                        <p className="section-desc">Interactive scenes built with Blender & Three.js</p>
                                        <div className="carousel-container project-carousel">
                                            <div className="carousel-stack">
                                                {blenderContent.projects.map((project, index) => {
                                                    const position = index - activeBlenderProjectIndex;
                                                    let positionClass = '';

                                                    if (position === 0) positionClass = 'active';
                                                    else if (position === -1 || (activeBlenderProjectIndex === 0 && index === blenderContent.projects.length - 1)) positionClass = 'prev';
                                                    else if (position === 1 || (activeBlenderProjectIndex === blenderContent.projects.length - 1 && index === 0)) positionClass = 'next';
                                                    else if (position < -1) positionClass = 'prev-hidden';
                                                    else positionClass = 'next-hidden';

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`carousel-card project-card ${positionClass}`}
                                                            onClick={() => {
                                                                if (position === 0) navigate(project.route);
                                                                else setActiveBlenderProjectIndex(index);
                                                            }}
                                                        >
                                                            <span className="border-line border-line-top"></span>
                                                            <span className="border-line border-line-right"></span>
                                                            <span className="border-line border-line-bottom"></span>
                                                            <span className="border-line border-line-left"></span>

                                                            <span className="project-icon">{project.icon}</span>
                                                            <h5 className="project-title">{project.title}</h5>
                                                            <p className="project-desc">{project.description}</p>
                                                            <div className="project-footer">
                                                                <span className="project-tag">{project.tag}</span>
                                                                <span className="preview-label">Preview →</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Project Dots */}
                                            <div className="carousel-dots project-dots">
                                                {blenderContent.projects.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={`project-dot ${index === activeBlenderProjectIndex ? 'active' : ''}`}
                                                        onClick={() => setActiveBlenderProjectIndex(index)}
                                                        aria-label={`Go to project ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Starter Kits Section */}
                                    <div className="blender-section starter-kits-section">
                                        <h4 className="section-title">📦 Starter Kits</h4>
                                        <p className="section-desc">Download my Blender project files</p>
                                        <div className="kits-grid">
                                            {blenderContent.starterKits.map((kit, index) => (
                                                <div key={index} className="kit-card">
                                                    <span className="kit-icon">{kit.icon}</span>
                                                    <h5 className="kit-name">{kit.name}</h5>
                                                    <p className="kit-desc">{kit.description}</p>
                                                    {kit.files.length > 0 && (
                                                        <button
                                                            className="download-btn global-download"
                                                            onClick={() => {
                                                                kit.files.forEach((file) => {
                                                                    const link = document.createElement('a');
                                                                    link.href = file;
                                                                    link.download = file.split('/').pop();
                                                                    link.click();
                                                                });
                                                            }}
                                                        >
                                                            📥 Download Full Kit
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gallery Section - Carousel Style */}
                                    <div className="blender-section gallery-section">
                                        <h4 className="section-title">🖼️ Blender Workspace</h4>
                                        <p className="section-desc">Renders and artwork from my 3D journey</p>

                                        <div className="carousel-container gallery-carousel">
                                            <div className="carousel-stack">
                                                {blenderContent.gallery.map((item, index) => {
                                                    const position = index - activeGalleryIndex;
                                                    let positionClass = '';

                                                    if (position === 0) positionClass = 'active';
                                                    else if (position === -1 || (activeGalleryIndex === 0 && index === blenderContent.gallery.length - 1)) positionClass = 'prev';
                                                    else if (position === 1 || (activeGalleryIndex === blenderContent.gallery.length - 1 && index === 0)) positionClass = 'next';
                                                    else if (position < -1) positionClass = 'prev-hidden';
                                                    else positionClass = 'next-hidden';

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`carousel-card gallery-card ${positionClass}`}
                                                            onClick={() => {
                                                                if (position === 0) setSelectedImage(item);
                                                                else setActiveGalleryIndex(index);
                                                            }}
                                                        >
                                                            <img src={item.src} alt={item.title} className="gallery-img-full" />
                                                            <div className="gallery-caption">
                                                                <h5 className="gallery-item-title">{item.title}</h5>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Gallery Dots */}
                                            <div className="carousel-dots gallery-dots">
                                                {blenderContent.gallery.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={`gallery-dot ${index === activeGalleryIndex ? 'active' : ''}`}
                                                        onClick={() => setActiveGalleryIndex(index)}
                                                        aria-label={`Go to image ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedShirt === 'fullstack' ? (
                                <div className="fullstack-content-reveal">
                                    {/* Header Icon */}
                                    <FullStackHeaderIcon src={fullStackContent.headerIcon} onLoaded={handleLottieLoaded} />

                                    {/* Skills Section */}
                                    <div className="fullstack-section skills-section">
                                        <h4 className="section-title">⚡ Tech Stack</h4>
                                        <div className="skills-grid-mern">
                                            {fullStackContent.skills.map((skill, index) => (
                                                <SkillCard key={index} skill={skill} onLoaded={handleLottieLoaded} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Projects Section */}
                                    <div className="fullstack-section projects-section">
                                        <h4 className="section-title">📂 Featured Projects</h4>
                                        <div className="carousel-container project-carousel">
                                            <div className="carousel-stack">
                                                {fullStackContent.projects.map((project, index) => {
                                                    const position = index - activeFullStackProjectIndex;
                                                    let positionClass = '';

                                                    if (position === 0) positionClass = 'active';
                                                    else if (position === -1 || (activeFullStackProjectIndex === 0 && index === fullStackContent.projects.length - 1)) positionClass = 'prev';
                                                    else if (position === 1 || (activeFullStackProjectIndex === fullStackContent.projects.length - 1 && index === 0)) positionClass = 'next';
                                                    else if (position < -1) positionClass = 'prev-hidden';
                                                    else positionClass = 'next-hidden';

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`carousel-card project-card-fs ${positionClass}`}
                                                            onClick={() => {
                                                                if (position === 0) window.open(project.link, '_blank');
                                                                else setActiveFullStackProjectIndex(index);
                                                            }}
                                                        >
                                                            <span className="border-line border-line-top"></span>
                                                            <span className="border-line border-line-right"></span>
                                                            <span className="border-line border-line-bottom"></span>
                                                            <span className="border-line border-line-left"></span>

                                                            <span className="project-icon">{project.icon}</span>
                                                            <h5 className="project-title">{project.title}</h5>
                                                            <p className="project-desc">{project.description}</p>
                                                            <div className="project-footer">
                                                                <span className="project-tag">{project.tag}</span>
                                                                <span className="preview-label">Live Demo →</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="carousel-dots project-dots">
                                                {fullStackContent.projects.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={`project-dot ${index === activeFullStackProjectIndex ? 'active' : ''}`}
                                                        onClick={() => setActiveFullStackProjectIndex(index)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3D Projects Section */}
                                    <div className="fullstack-section projects-section">
                                        <h4 className="section-title">🎬 3D Craft</h4>
                                        <div className="carousel-container project-carousel">
                                            <div className="carousel-stack">
                                                {fullStackContent.projects3D.map((project, index) => {
                                                    const position = index - activeFullStack3DProjectIndex;
                                                    let positionClass = '';

                                                    if (position === 0) positionClass = 'active';
                                                    else if (position === -1 || (activeFullStack3DProjectIndex === 0 && index === fullStackContent.projects3D.length - 1)) positionClass = 'prev';
                                                    else if (position === 1 || (activeFullStack3DProjectIndex === fullStackContent.projects3D.length - 1 && index === 0)) positionClass = 'next';
                                                    else if (position < -1) positionClass = 'prev-hidden';
                                                    else positionClass = 'next-hidden';

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`carousel-card project-card-fs ${positionClass}`}
                                                            onClick={() => {
                                                                if (position === 0) navigate(project.route);
                                                                else setActiveFullStack3DProjectIndex(index);
                                                            }}
                                                        >
                                                            <span className="border-line border-line-top"></span>
                                                            <span className="border-line border-line-right"></span>
                                                            <span className="border-line border-line-bottom"></span>
                                                            <span className="border-line border-line-left"></span>

                                                            <span className="project-icon">{project.icon}</span>
                                                            <h5 className="project-title">{project.title}</h5>
                                                            <p className="project-desc">{project.description}</p>
                                                            <div className="project-footer">
                                                                <span className="project-tag">{project.tag}</span>
                                                                <span className="preview-label">Explore →</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="carousel-dots project-dots">
                                                {fullStackContent.projects3D.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={`project-dot ${index === activeFullStack3DProjectIndex ? 'active' : ''}`}
                                                        onClick={() => setActiveFullStack3DProjectIndex(index)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Games Section */}
                                    <div className="fullstack-section games-section">
                                        <h4 className="section-title">🎮 Play Zone</h4>
                                        <div className="games-grid-mern">
                                            {fullStackContent.games.map((game, index) => (
                                                <div
                                                    key={index}
                                                    className="game-card-mern"
                                                    onClick={() => navigate(game.route)}
                                                >
                                                    <span className="game-icon">{game.icon}</span>
                                                    <h5 className="game-title">{game.title}</h5>
                                                    <p className="game-desc">{game.description}</p>
                                                    <span className="play-label">PLAY NOW</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Stacked Carousel for Football/Enfield */
                                <div className="carousel-reveal">
                                    <div className="carousel-container">
                                        <div className="carousel-stack">
                                            {currentContent.cards.map((card, index) => {
                                                const position = index - activeCardIndex;
                                                let positionClass = '';

                                                if (position === 0) positionClass = 'active';
                                                else if (position === -1 || (activeCardIndex === 0 && index === currentContent.cards.length - 1)) positionClass = 'prev';
                                                else if (position === 1 || (activeCardIndex === currentContent.cards.length - 1 && index === 0)) positionClass = 'next';
                                                else if (position < -1) positionClass = 'prev-hidden';
                                                else positionClass = 'next-hidden';

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`carousel-card ${positionClass}`}
                                                        onClick={() => setActiveCardIndex(index)}
                                                    >
                                                        <span className="border-line border-line-top"></span>
                                                        <span className="border-line border-line-right"></span>
                                                        <span className="border-line border-line-bottom"></span>
                                                        <span className="border-line border-line-left"></span>

                                                        {card.icon.startsWith('/') ? (
                                                            <img src={card.icon} alt={card.title} className="card-icon-img" />
                                                        ) : (
                                                            <span className="card-icon">{card.icon}</span>
                                                        )}
                                                        <h4 className="card-title">{card.title}</h4>
                                                        <p className="card-description">{card.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="carousel-dots">
                                            {currentContent.cards.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`carousel-dot ${index === activeCardIndex ? 'active' : ''}`}
                                                    onClick={() => setActiveCardIndex(index)}
                                                    aria-label={`Go to card ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact FAB - Portaled to body for guaranteed z-index/visibility */}
            {createPortal(
                <div className={`contact-fab-container ${selectedShirt} ${isContactOpen ? 'open' : ''}`}>
                    <div className="contact-options">
                        <a href="mailto:mohammed.hafiz.4755@gmail.com?subject=Inquiry%20from%20Portfolio&body=Hi%20Hafiz,%0D%0A%0D%0AI%20saw%20your%20portfolio%20and%20wanted%20to%20get%20in%20touch." className="contact-option email" title="Mail Me">
                            <img src="/assets/icons/email.svg" alt="Email" />
                            <span className="tooltip">mohammed.hafiz.4755@gmail.com</span>
                        </a>
                        <a href="https://www.linkedin.com/in/hafiz-webdeveloper/" target="_blank" rel="noopener noreferrer" className="contact-option linkedin" title="LinkedIn">
                            <img src="/assets/icons/linkedin.svg" alt="LinkedIn" />
                            <span className="tooltip">LinkedIn Profile</span>
                        </a>
                        <a href="https://github.com/hafiz475" target="_blank" rel="noopener noreferrer" className="contact-option github" title="GitHub">
                            <img src="/assets/icons/github.svg" alt="GitHub" />
                            <span className="tooltip">GitHub Profile</span>
                        </a>
                        <a href="https://wa.me/918754274815?text=Hi%20Hafiz!%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect." target="_blank" rel="noopener noreferrer" className="contact-option phone" title="WhatsApp Me">
                            <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" />
                            <span className="tooltip">Chat on WhatsApp</span>
                        </a>
                    </div>
                    <button
                        className="contact-trigger"
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        title="Contact Me"
                    >
                        <div className="trigger-icon">
                            {isContactOpen ? '×' : '👋'}
                        </div>
                    </button>
                </div>,
                document.body
            )}

            {/* Image Modal */}
            {selectedImage && createPortal(
                <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedImage(null)}>×</button>
                        <img src={selectedImage.src} alt={selectedImage.title} className="modal-image" />
                        {selectedImage.title && <h4 className="modal-title">{selectedImage.title}</h4>}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
