import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./Home.css";
import bulletImg from "../assets/bullet.jpg";
import domeImg from "../assets/dome.jpg";
import Footer from "../components/Footer";

const images = [
  { src: bulletImg, alt: "Bullet Camera" },
  { src: domeImg, alt: "Dome Camera" },
];

// Typing Animation Component
function TypingAnimation({ text, speed = 100 }) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <span aria-live="polite">
      {displayText}
      <span className="cursor" aria-hidden="true">|</span>
    </span>
  );
}

// Testimonials Slider
function TestimonialsSlider() {
  const testimonials = useMemo(
    () => [
      { 
        name: "John Doe", 
        role: "Home Owner", 
        text: "Exceptional security products with lightning-fast delivery! The installation support was outstanding." 
      },
      { 
        name: "Jane Smith", 
        role: "Business Owner", 
        text: "Professional support and highly reliable systems. Our business security has never been better." 
      },
      { 
        name: "Mike Johnson", 
        role: "Security Expert", 
        text: "Innovative solutions with unmatched quality. These products exceed industry standards." 
      },
      { 
        name: "Sarah Wilson", 
        role: "Property Manager", 
        text: "The customer service team went above and beyond to help us set up our multi-property security system." 
      },
    ],
    []
  );

  const [current, setCurrent] = useState(0);

  const handleDotClick = useCallback((idx) => {
    setCurrent(idx);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="testimonials-slider" role="region" aria-label="Customer Testimonials">
      <div className="testimonial-card glassmorphism">
        <p className="testimonial-text">"{testimonials[current].text}"</p>
        <div className="testimonial-author">
          <strong>{testimonials[current].name}</strong>
          <span> - {testimonials[current].role}</span>
        </div>
      </div>
      <div className="slider-dots">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to testimonial ${idx + 1}`}
            aria-current={idx === current}
          ></button>
        ))}
      </div>
    </div>
  );
}

// Animated Counter
function Counter({ end, label, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const animate = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(Math.floor(start));
        requestAnimationFrame(animate);
      }
    };
    
    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, isVisible]);

  return (
    <div className="stat fade-in" ref={ref}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// Progress Bar
function ProgressBar({ label, value, max }) {
  const [width, setWidth] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setWidth((value / max) * 100);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [value, max]);

  return (
    <div className="progress-bar-container fade-up" ref={ref}>
      <div className="progress-bar-label">{label}</div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles loaded:", container);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <Helmet>
        <title>SecureVision - Premium CCTV & Home Security Solutions</title>
        <meta
          name="description"
          content="Discover top-quality CCTV and security solutions for homes and businesses with fast delivery and expert support. Protect what matters most with SecureVision."
        />
        <meta name="keywords" content="CCTV, security cameras, home security, business security, surveillance systems" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            particles: {
              number: { 
                value: 80, 
                density: { 
                  enable: true, 
                  value_area: 800 
                } 
              },
              color: { 
                value: ["#003087", "#0066cc", "#4c51bf"] 
              },
              shape: { 
                type: "circle" 
              },
              opacity: { 
                value: 0.3, 
                random: true 
              },
              size: { 
                value: 4, 
                random: true 
              },
              move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "bounce",
                bounce: true,
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { 
                  enable: true, 
                  mode: "repulse" 
                },
                onclick: { 
                  enable: true, 
                  mode: "push" 
                },
                resize: true,
              },
            },
            retina_detect: true,
          }}
        />
        <div className="hero-content">
          <span className="hero-badge">PREMIUM SECURITY SOLUTIONS</span>
          <h1 id="hero-title" className="hero-title">
            <TypingAnimation text="Protect What Matters Most" speed={150} />
          </h1>
          <p className="hero-subtitle">
            Discover the best in CCTV and security solutions for your home and business.
            <br />
            Shop trusted brands, expert support, and fast nationwide delivery.
          </p>
          <div className="hero-buttons">
            <a href="/products" className="hero-btn">EXPLORE PRODUCTS</a>
            <a href="/admin/login" className="hero-btn admin-btn">ADMIN LOGIN</a>
          </div>
        </div>
        <div className="hero-image">
          {images.map((image, idx) => (
            <img
              key={image.alt}
              src={image.src}
              alt={image.alt}
              className={`hero-img ${idx === currentIndex ? 'active' : ''}`}
              loading="lazy"
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section fade-up" aria-labelledby="features-title">
        <h2 id="features-title" className="features-title">Why Choose SecureVision?</h2>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Premium Quality">⭐</span>
            <h3>Premium Quality</h3>
            <p>We offer only the most reliable and top-rated CCTV and security products with industry-leading warranties.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Expert Support">🔧</span>
            <h3>Expert Support</h3>
            <p>Our certified team provides professional installation guidance and 24/7 technical support for your peace of mind.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Fast Nationwide Delivery">🚀</span>
            <h3>Fast Delivery</h3>
            <p>Get your security products quickly with our nationwide shipping network and real-time tracking.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Smart Technology">🤖</span>
            <h3>Smart Technology</h3>
            <p>Advanced features including AI detection, mobile integration, and cloud storage for modern security needs.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section" aria-labelledby="stats-title">
        <h2 id="stats-title" className="section-title">Trusted by Thousands</h2>
        <div className="stats-row">
          <Counter end={2500} label="Happy Customers" />
          <Counter end={16} label="Years Experience" />
          <Counter end={50} label="Security Products" />
          <Counter end={98} label="Satisfaction Rate" suffix="%" />
        </div>
      </section>

      {/* Progress Section */}
      <section className="progress-section" aria-labelledby="progress-title">
        <h2 id="progress-title" className="section-title">Our Excellence Metrics</h2>
        <ProgressBar label="Customer Satisfaction Rate" value={98} max={100} />
        <ProgressBar label="Product Quality Score" value={95} max={100} />
        <ProgressBar label="On-Time Delivery Performance" value={99} max={100} />
        <ProgressBar label="Technical Support Response Time" value={90} max={100} />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="section-title">What Our Customers Say</h2>
        <TestimonialsSlider />
      </section>

      {/* Additional CTA Section */}
      <section className="cta-section fade-up">
        <div className="cta-content glassmorphism">
          <h2>Ready to Secure Your Property?</h2>
          <p>Join thousands of satisfied customers who trust SecureVision for their security needs.</p>
          <div className="cta-buttons">
            <a href="/products" className="hero-btn">GET STARTED</a>
            <a href="/contact" className="hero-btn admin-btn">CONTACT US</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;