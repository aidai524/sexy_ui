import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./tab.module.css";

export type Node = {
  name: string;
  content: React.ReactNode;
};

interface Props {
  nodes: Node[];
  tabContentStyle?: any;
  tabHeaderStyle?: any;
  activeNode?: string;
  onTabChange?: (nodeName: string) => void;
}

export default function Tab({
  nodes,
  activeNode,
  tabContentStyle = {},
  tabHeaderStyle = {},
  onTabChange
}: Props) {
  const [tabIndex, setTabIndex] = useState(0);
  const prevI = useRef<number[]>([0]);

  useEffect(() => {
    if (activeNode) {
      let tabIndex = 0;
      nodes.some((node, index) => {
        if (node.name === activeNode) {
          tabIndex = index;
          return true;
        }
      });

      setTabIndex(tabIndex);
    }
  }, [activeNode, onTabChange, nodes]);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabHeaders}>
        {nodes.map((node, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setTabIndex(index);
                onTabChange && onTabChange(node.name);
                prevI.current.push(index);
                if (prevI.current.length > 2) prevI.current.shift();
              }}
              className={(tabIndex === index
                ? [styles.tab, styles.active]
                : [styles.tab]
              ).join(" ")}
              style={tabHeaderStyle}
            >
              <span> {node.name}</span>
              {tabIndex === index && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {
                      x: index < prevI.current[0] ? "50%" : "-50%"
                    },
                    show: {
                      x: "0%",
                      transition: {
                        staggerChildren: 0.3
                      }
                    }
                  }}
                  className={styles.Line}
                />
              )}
            </div>
          );
        })}
      </div>

      {nodes.map((node, index) => {
        // if (tabIndex !== index) {
        //   return null;
        // }
        return (
          <div
            key={index}
            className={styles.tabContent}
            style={{
              ...tabContentStyle,
              display: tabIndex !== index ? "none" : "block"
            }}
          >
            {node.content}
          </div>
        );
      })}
    </div>
  );
}
