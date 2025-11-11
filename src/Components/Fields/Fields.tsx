import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import "./Fields.scss";

const fieldsData = [
  { image: "/images/FieldsSVG/Product Design.svg", text: "Product Design" },
  { image: "/images/FieldsSVG/Copywriting.svg", text: "Copywriting" },
  { image: "/images/FieldsSVG/Design Engineering.svg", text: "Design Engineering" },
  { image: "/images/FieldsSVG/UX Research.svg", text: "UX Research" },
  { image: "/images/FieldsSVG/Software Engineering.svg", text: "Graphic Design" },
];

export default function Fields() {
  const [canScroll, setCanScroll] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      dragFree: true,
      containScroll: "trimSnaps",
      watchDrag: true,
    },
    [WheelGesturesPlugin({ forceWheelAxis: "x" })]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const checkScrollability = () => {
      const containerNode = emblaApi.containerNode();
      const containerWidth = containerNode.offsetWidth;
      const scrollWidth = containerNode.scrollWidth;
      const needsScroll = scrollWidth > containerWidth;
      
      setCanScroll(needsScroll);
    };

    const handleResize = () => {
      setTimeout(() => {
        checkScrollability();
      }, 100);
    };

    emblaApi.on("resize", checkScrollability);
    emblaApi.on("reInit", checkScrollability);
    
    // Initial check after a short delay to ensure DOM is ready
    setTimeout(() => {
      checkScrollability();
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      emblaApi.off("resize", checkScrollability);
      emblaApi.off("reInit", checkScrollability);
    };
  }, [emblaApi]);

  // Disable dragging when scrolling is not needed
  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.reInit({
      loop: false,
      dragFree: canScroll,
      containScroll: "trimSnaps",
      watchDrag: canScroll,
    });
  }, [canScroll, emblaApi]);

  return (
    <div className="fields">
      <div className="fields-content">
        <h2 className="fields-title">
          Discover Fields Dedicated to Craft & Problem Solving
        </h2>
        <div 
          className={`fields-container embla ${!canScroll ? 'no-scroll' : ''}`} 
          ref={emblaRef}
        >
          <div className="embla__container">
            {fieldsData.map((field, index) => (
              <div className="embla__slide field-card" key={index}>
                <img
                  src={field.image}
                  alt={field.text}
                  className="field-image"
                />
                <p className="field-text">{field.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
