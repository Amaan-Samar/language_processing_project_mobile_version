import { useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useScrollVisibility = () => {
  const [showButton, setShowButton] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const isScrollingDown = currentScrollY > lastScrollY.current;

        if (isScrollingDown && currentScrollY > 50) {
          setShowButton(false);
        } else if (!isScrollingDown) {
          setShowButton(true);
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  return { scrollY, showButton, handleScroll };
};