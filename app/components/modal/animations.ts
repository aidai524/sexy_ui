export default {
  modal: {
    initial: {
      scale: 0.8
    },
    animate: {
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      scale: 0.8
    }
  },
  popup: {
    initial: {
      y: "100%"
    },
    animate: {
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      y: "100%"
    }
  }
} as any;
