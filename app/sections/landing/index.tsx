import { motion } from 'framer-motion';
import TitleIcon from '@/app/components/layout/laptop/menu/title-icon';
import styles from './Landing.module.css';
import { useUserAgent } from '@/app/context/user-agent';

const Landing = () => {
    const { isMobile } = useUserAgent();

    return (
        <div style={{ height: '100vh', overflow: 'auto' }}>
            <div className={styles.container + " " + (isMobile ? styles.mobile : styles.pc)}>
                <div className={styles.titleIcon}>
                    <TitleIcon />
                </div>

                <div className={styles.left}>
                    <div className={styles.doorSection + " " + styles.mainPic}>
                        <img src="/img/landing/pic1.gif" alt="Door illustration" />
                    </div>

                    <div className={styles.spinningLogo + " " + styles.mainPic}>
                        <img src="/img/landing/pic3.gif" alt="Spinning logo" />
                    </div>
                </div>

                <div className={styles.middle}>
                    <div className={styles.frogSection + " " + styles.mainPic}>
                        <img src="/img/landing/pic2.gif" alt="Frog illustration" />
                    </div>

                    <div className={styles.chartSection + " " + styles.mainPic}>
                        <img src="/img/landing/pic4.gif" alt="Trading chart" />
                    </div>
                </div>



                <div className={styles.right}>
                    <div className={styles.heroSection}>
                        <img src="/img/landing/logo.svg" alt="Hero title" className={styles.icon} />
                        <h1 className={styles.heroTitle}>Memecoins are supposed to be fun MMGA - Make Memes Great Again</h1>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className={styles.heroDesc}>Trade and launch memecoins as easy as scrolling Tiktok. Coming soon to Solana.</p>
                        </motion.div>
                        <button className={styles.watchButton}>Watch Now</button>

                        <div className={styles.light1}>
                            <img src="/img/landing/light1.svg" alt="Light 1" />
                        </div>

                        <div className={styles.light2}>
                            <img src="/img/landing/light2.svg" alt="Light 2" />
                        </div>

                        <div className={styles.light3}>
                            <img src="/img/landing/light3.svg" alt="Light 3" />
                        </div>
                    </div>

                    {
                        isMobile && (
                            <motion.div
                                style={{
                                    width: '100vw',
                                    display: 'flex',
                                    marginTop: 25
                                }}
                            >
                                <motion.div
                                    animate={{
                                        x: ['0%', '-300vw'],
                                    }}
                                    transition={{
                                        duration: 10,
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                        ease: 'linear',
                                    }}
                                    style={{
                                        width: '400vw',
                                        display: 'flex',
                                        gap: 10,
                                    }}
                                >
                                    <img src="/img/landing/pic1.gif" alt="Door illustration" style={{ width: '100vw', marginTop: 50, display: 'block', borderRadius: 16 }} />
                                    <img src="/img/landing/pic3.gif" alt="Spinning logo" style={{ width: '100vw', display: 'block', borderRadius: 16, marginBottom: 50 }} />
                                    <img src="/img/landing/pic2.gif" alt="Frog illustration" style={{ width: '100vw', marginTop: 50, display: 'block', borderRadius: 16 }} />
                                    <img src="/img/landing/pic4.gif" alt="Trading chart" style={{ width: '100vw', display: 'block', borderRadius: 16, marginBottom: 50 }} />
                                </motion.div>
                            </motion.div>
                        )}

                    <div className={styles.featuresSection}>
                        <img src="/img/landing/pc-text.png" alt="Features" className={styles.pcText} />
                        <img src="/img/landing/mobile-text.png" alt="Features" className={styles.mobileText} />
                    </div>
                </div>

                <div className={styles.footer}>
                    <img className={styles.footerIcon} src="/img/community/x.svg" alt="X" />
                    <img className={styles.footerIcon} src="/img/community/telegram.svg" alt="Telegram" />
                </div>
            </div>
        </div>
    );
};

export default Landing;
