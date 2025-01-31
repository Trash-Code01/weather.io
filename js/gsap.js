
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const timeline = gsap.timeline();

  // Animate the logo with a pop-up effect
  timeline.from("#nav #logo", {
    y: -50, // Move from above
    scale: 0.5, // Start at half the size
    opacity: 0, // Start with no opacity
    duration: 1, // Duration of the animation
    ease: "bounce.out", // Bounce effect
  });

  // Animate nav links from above
  timeline.from(".nav-link li", {
    y: -30, // Move from above
    opacity: 0, // Start with no opacity
    duration: 0.8, // Animation duration
    stagger: 0.2, // Delay between each link
    ease: "power2.out", // Smooth easing
  });
});


gsap.from("#mainsec", {
  y: 50, // Moves the section up by 50px
  opacity: 0, // Starts fully transparent
  duration: 1, // Animation duration
  delay: 0.1, // Small delay before the animation starts
  scrollTrigger: {
    trigger: "body", // The element that triggers the animation
    start: "top 80%", // Trigger when the top of #test reaches 80% of the viewport height
    toggleActions: "play reset play reset", // Play animation on enter
  }
});

gsap.from("#air-quality",{
  x:-50,
  opacity: 0, 
      duration: 1,
      delay: 0.4,
      scrollTrigger:{
          trigger: "#air-quality",
          scroller: "body", 
          toggleActions: "play reset play reset",
      }
  });
gsap.from("#aqicity",{
  x:-50,
  opacity: 0, 
      duration: 1,
      delay: 0.4,
      scrollTrigger:{
          trigger: "#aqicity",
          scroller: "body", 
          toggleActions: "play reset play reset",
      }
  });
gsap.from("#hed",{
  x:-50,
  opacity: 0, 
      duration: 1,
      delay: 0.4,
      scrollTrigger:{
          trigger: "#hed",
          scroller: "body", 
          toggleActions: "play reset play reset",
      }
  });
gsap.from("#air-pollution",{
  y:50,
  opacity: 0, 
      duration: 1,
      delay: 0.4,
      scrollTrigger:{
          trigger: "#air-pollution",
          scroller: "body", 
          toggleActions: "play reset play reset",
      }
  });


 
