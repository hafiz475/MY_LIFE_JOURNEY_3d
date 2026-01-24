import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
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

export default function RoomScene({ onBack }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedShirt, setSelectedShirt] = useState('football');
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [activeBlenderProjectIndex, setActiveBlenderProjectIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    // Check if we're on the /software route
    const showSoftware = location.pathname === '/software';

    // Reset indices when shirt changes
    useEffect(() => {
        setActiveCardIndex(0);
        setActiveGalleryIndex(0);
        setActiveBlenderProjectIndex(0);
    }, [selectedShirt]);

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
            : blenderContent;

    // Show software scene if on /software route
    if (showSoftware) {
        return <SoftwareScene onBack={handleBackFromSoftware} />;
    }

    return (
        <>
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
                        <div
                            className={`tshirt-item ${selectedShirt === 'football' ? 'active' : ''}`}
                            onClick={() => setSelectedShirt('football')}
                        >
                            <div className="hanger"></div>
                            <img
                                src="/assets/2dModels/football_tshirt.png"
                                alt="Football Jersey"
                                className="tshirt-image"
                            />
                            <span className="tshirt-label">Football</span>
                        </div>

                        <div
                            className={`tshirt-item ${selectedShirt === 'enfield' ? 'active' : ''}`}
                            onClick={() => setSelectedShirt('enfield')}
                        >
                            <div className="hanger"></div>
                            <img
                                src="/assets/2dModels/RE_tshirt.png"
                                alt="Royal Enfield"
                                className="tshirt-image"
                            />
                            <span className="tshirt-label">Royal Enfield</span>
                        </div>

                        <div
                            className={`tshirt-item ${selectedShirt === 'blender' ? 'active' : ''}`}
                            onClick={() => setSelectedShirt('blender')}
                        >
                            <div className="hanger"></div>
                            <img
                                src="/assets/2dModels/blender_tshirt.png"
                                alt="Blender 3D"
                                className="tshirt-image"
                            />
                            <span className="tshirt-label">Blender</span>
                        </div>
                    </div>

                    {/* Content Display */}
                    <div className={`passion-display ${selectedShirt}`}>
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
                            <>
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
                            </>
                        ) : (
                            /* Stacked Carousel for Football/Enfield */
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
                        )}
                    </div>

                    {/* Software Journey Button - Bottom Center */}
                    <div className="software-journey-section">
                        <p className="journey-tagline">
                            Ready to explore my professional side?
                            <span className="css-laptop">
                                <span className="laptop-screen"></span>
                                <span className="laptop-base"></span>
                            </span>
                        </p>
                        <button className="journey-btn" onClick={handleEnterSoftware}>
                            <span className="btn-line btn-line-top"></span>
                            <span className="btn-line btn-line-right"></span>
                            <span className="btn-line btn-line-bottom"></span>
                            <span className="btn-line btn-line-left"></span>
                            <span className="journey-text">EXPLORE SOFTWARE CRAFT</span>
                        </button>
                    </div>

                </div>
            </div>

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
