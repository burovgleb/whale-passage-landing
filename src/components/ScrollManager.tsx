import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const SCROLL_STORAGE_KEY = "kky:scroll-positions";

const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef<Record<string, number>>({});
  const previousKeyRef = useRef(location.key);
  const previousPathnameRef = useRef(location.pathname);
  const previousSearchRef = useRef(location.search);
  const previousHashRef = useRef(location.hash);
  const scrollLockFrameRef = useRef<number | null>(null);
  const behaviorOverrideRef = useRef<{
    htmlValue: string;
    htmlPriority: string;
    bodyValue: string;
    bodyPriority: string;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Record<string, number>;
      if (parsed && typeof parsed === "object") {
        positionsRef.current = parsed;
      }
    } catch {
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const { history } = window;
    const previousValue = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const restoreBehaviorOverride = () => {
      if (!behaviorOverrideRef.current) return;

      const html = document.documentElement;
      const body = document.body;
      const { htmlValue, htmlPriority, bodyValue, bodyPriority } = behaviorOverrideRef.current;

      if (htmlValue) {
        html.style.setProperty("scroll-behavior", htmlValue, htmlPriority);
      } else {
        html.style.removeProperty("scroll-behavior");
      }

      if (bodyValue) {
        body.style.setProperty("scroll-behavior", bodyValue, bodyPriority);
      } else {
        body.style.removeProperty("scroll-behavior");
      }

      behaviorOverrideRef.current = null;
    };

    return () => {
      if (scrollLockFrameRef.current !== null) {
        cancelAnimationFrame(scrollLockFrameRef.current);
        scrollLockFrameRef.current = null;
      }
      restoreBehaviorOverride();
      history.scrollRestoration = previousValue;
    };
  }, []);

  useLayoutEffect(() => {
    const previousKey = previousKeyRef.current;
    positionsRef.current[previousKey] = window.scrollY;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positionsRef.current));

    const isHashOnlyNavigation =
      previousPathnameRef.current === location.pathname &&
      previousSearchRef.current === location.search &&
      previousHashRef.current !== location.hash;

    if (isHashOnlyNavigation) {
      previousKeyRef.current = location.key;
      previousPathnameRef.current = location.pathname;
      previousSearchRef.current = location.search;
      previousHashRef.current = location.hash;
      return;
    }

    const applyBehaviorOverride = () => {
      if (behaviorOverrideRef.current) return;

      const html = document.documentElement;
      const body = document.body;
      const previousHtmlBehavior = html.style.getPropertyValue("scroll-behavior");
      const previousHtmlPriority = html.style.getPropertyPriority("scroll-behavior");
      const previousBodyBehavior = body.style.getPropertyValue("scroll-behavior");
      const previousBodyPriority = body.style.getPropertyPriority("scroll-behavior");

      behaviorOverrideRef.current = {
        htmlValue: previousHtmlBehavior,
        htmlPriority: previousHtmlPriority,
        bodyValue: previousBodyBehavior,
        bodyPriority: previousBodyPriority,
      };

      html.style.setProperty("scroll-behavior", "auto", "important");
      body.style.setProperty("scroll-behavior", "auto", "important");
    };

    const restoreBehaviorOverride = () => {
      if (!behaviorOverrideRef.current) return;

      const html = document.documentElement;
      const body = document.body;
      const { htmlValue, htmlPriority, bodyValue, bodyPriority } = behaviorOverrideRef.current;

      if (htmlValue) {
        html.style.setProperty("scroll-behavior", htmlValue, htmlPriority);
      } else {
        html.style.removeProperty("scroll-behavior");
      }

      if (bodyValue) {
        body.style.setProperty("scroll-behavior", bodyValue, bodyPriority);
      } else {
        body.style.removeProperty("scroll-behavior");
      }

      behaviorOverrideRef.current = null;
    };

    const lockScrollPosition = (targetY: number) => {
      if (scrollLockFrameRef.current !== null) {
        cancelAnimationFrame(scrollLockFrameRef.current);
      }

      applyBehaviorOverride();

      let frame = 0;
      const maxFrames = 16;

      const tick = () => {
        window.scrollTo(0, targetY);

        frame += 1;
        if (frame < maxFrames) {
          scrollLockFrameRef.current = requestAnimationFrame(tick);
        } else {
          scrollLockFrameRef.current = null;
          restoreBehaviorOverride();
        }
      };

      tick();
    };

    const getHashTargetY = () => {
      const rawHash = location.hash.slice(1);
      if (!rawHash) return null;

      const hash = decodeURIComponent(rawHash);
      const escapedHash = CSS.escape(hash);
      const target =
        document.getElementById(hash) ??
        document.querySelector<HTMLElement>(`[name="${escapedHash}"]`);

      if (!target) return null;

      return Math.max(
        0,
        Math.round(target.getBoundingClientRect().top + window.scrollY),
      );
    };

    const hashTargetY = getHashTargetY();
    if (typeof hashTargetY === "number") {
      lockScrollPosition(hashTargetY);
      previousKeyRef.current = location.key;
      previousPathnameRef.current = location.pathname;
      previousSearchRef.current = location.search;
      previousHashRef.current = location.hash;
      return;
    }

    if (navigationType === "POP") {
      const savedPosition = positionsRef.current[location.key];
      lockScrollPosition(typeof savedPosition === "number" ? savedPosition : 0);
    } else {
      lockScrollPosition(0);
    }

    previousKeyRef.current = location.key;
    previousPathnameRef.current = location.pathname;
    previousSearchRef.current = location.search;
    previousHashRef.current = location.hash;
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  return null;
};

export default ScrollManager;
