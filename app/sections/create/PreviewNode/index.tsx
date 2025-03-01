import styles from "./preview.module.css";
import Create from "../components/create";

import type { Project } from "@/app/type";
import { forwardRef, useEffect, useState, useImperativeHandle, useMemo, useRef } from "react";
import { httpAuthPost, sleep } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import MobileInfo from "./mobile-info";
import LaptopInfo from "./laptop-info";
import { useRouter } from "next/navigation";
import { useAccount } from "@/app/hooks/useAccount";
import { useUser } from "@/app/store/useUser";
import { useUserAgent } from "@/app/context/user-agent";
import StepAction from "../components/stepAction";
import MobileToken from "../../home/mobile/token";
import LaptopToken from "../../home/laptop/token";
import { head } from "lodash-es";
import { useTokenPanelStatus } from "@/app/store/use-token-panel";

interface Props {
  show: boolean;
  data: Project;
  step: number;
  onNext: () => void;
  onBack: () => void;
  goBackTo?: () => void;
}

export default forwardRef(function PreviewNode(
  { show, data, step, onNext, onBack, goBackTo }: Props,
  ref: any
) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [newData, setNewData] = useState(data);
  const [activeTab, setActiveTab] = useState('flow'); // 添加新的 state
  const { isMobile } = useUserAgent();
  const { address } = useAccount();
  const { userInfo }: any = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { innerHeight } = useUserAgent();
  const tokenPanelStatusStore: any = useTokenPanelStatus();

  const submitFnRef = useRef<any | null>(null);

  useEffect(() => {
    if (userInfo && data) {
      const newData = {
        ...data,
        account: userInfo.address,
        creater: userInfo,
        time: Date.now(),
        timeLeft: Date.now() + 1000 * 60 * 60 * 3
      };
      setNewData(newData);
    }
  }, [data, userInfo]);

  useImperativeHandle(
    ref,
    () => ({
      onEdit: onBack,
      onCreate: () => {
        setShowCreate(true);
      }
    }),
    []
  );

  const query = useMemo(() => {
    const query: any = {
      about_us: data.about,
      discord: data.discord,
      icon: data.tokenIcon,
      tg: data.tg,
      ticker: data.ticker,
      token_name: data.tokenName,
      token_symbol: data.tokenSymbol,
      video: data.tokenImg,
      website: data.website,
      x: data.x
    };

    const queryStr = Object.keys(query)
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join("&");

    return queryStr;
  }, [data]);


  const showAction = useMemo(() => {
    if (step === 3 && isMobile) {
      return true
    }

    if (step === 2 && !isMobile) {
      return true
    }

    return false
  }, [step, isMobile])

  const ActionBtn = <>
    {
      (showAction) && <div className={styles.stepActionWrapper}><StepAction
        step={step}
        isLoading={isLoading}
        btnText={step === 4 ? 'Get' : 'Continue'}
        onBack={() => {
          onBack();
        }}
        extendBtn={
          step === 4 && <div className={styles.skipBtn} onClick={() => {
          }}>Skip</div>
        }
        onNext={async () => {
          if (step === 3 && isMobile) {
            onNext();
          }

          if (step === 2 && !isMobile) {
            onNext()
          }
        }}
      />
      </div>
    }
  </>

  return (
    <div
      className={styles.mainContent + ' ' + (isMobile ? styles.mainContentMobile : styles.mainContentPc)}
      style={{
        display: show ? "block" : "none",
        paddingBottom: isMobile ? 80 : 0,
        // minHeight: isMobile ? "100vh" : "auto"
      }}
    >
      {
        (step === 2 && !isMobile) && <div className={styles.previewPc}><div>
          <LaptopToken
            isCurrent={true}
            style={{
              // width: '100%',
              // overflow: 'visible',
              // position: 'relative',
            }}
            token={{
              ...newData,
              id: 'preview',
              like: 0,
              icon: newData.tokenIcon || '/img/default-token.png',
              timeLeft: Date.now() + 1000 * 60 * 60 * 3
            }}
            showTrade={tokenPanelStatusStore.showTrade}
            tradeTab={'details'}
            onUpdateTradeTab={tokenPanelStatusStore.setTab}
            onOpenPanel={(panleType: string) => {
              tokenPanelStatusStore.setShow(
                panleType,
                !tokenPanelStatusStore[panleType]
              );
            }}
            showFlip={false}
            isPreview={true}
            isPreviewNoOpacity={true}
            dataAvailable={true}
          />
          {
            ActionBtn
          }
        </div>
        </div>
      }

      {
        ((step === 3 && isMobile)) && <>
          <div className={styles.previewTab}>
            <div
              className={`${styles.previewTabItem} ${activeTab === 'flow' ? styles.active : ''}`}
              onClick={() => setActiveTab('flow')}
            >
              Flow
            </div>
            <div
              className={`${styles.previewTabItem} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </div>
          </div>
          <div className={isMobile ? styles.main : styles.laptopMain}>
            {activeTab === 'details' ? (
              isMobile ? <MobileInfo newData={newData} /> : <LaptopInfo newData={newData} />
            ) : (
              <div style={{ zIndex: 1, position: 'relative', top: '-74px', height: '70vh' }}>
                <MobileToken
                  isCurrent={true}
                  style={{
                    height: innerHeight - 100,
                    overflow: 'hidden',
                    width: '100%'
                  }}
                  token={{
                    ...newData,
                    id: Date.now(),
                    like: 0,
                    icon: newData.tokenIcon || '/img/default-token.png',
                    timeLeft: Date.now() + 1000 * 60 * 60 * 3
                  }}
                  isPreview={true}
                  isPreviewNoOpacity={true}
                  dataAvailable={true}
                />
              </div>
            )}
          </div>
        </>
      }

      {
        (step === 4 || (step === 3 && !isMobile)) && <Create
          token={{
            tokenName: data.tokenName,
            tokenSymbol: data.tokenSymbol,
            tokenDecimals: 6,
            tokenUri: data.tokenIcon || data.tokenImg
          }}
          data={data}
          getSubmitFn={(submitFn: any) => {
            submitFnRef.current = submitFn
          }}
          goBackTo={() => {
            console.log('goBackTo')
            goBackTo && goBackTo()
            // setStep(2)
          }}
          onBeforeCreate={async () => {
            const val = await httpAuthPost(`/project/data?${query}`, {});
            return val.code === 0;
          }}
          onCreateTokenSuccess={async () => {
            let times = 0,
              val;
            while (times < 50) {
              val = await httpAuthPost(`/project?${query}`, {});
              if (val.code === 100000) {
                times++;
                await sleep(5000);
              } else {
                break;
              }
            }

            if (val.code === 0) {
              onNext()
              return true;
              // success('Create token success')
              // router.push('/profile')
            } else {
              fail("Create token fail");
              return false;
            }
          }}
        />
      }

      {
        step === 3 && isMobile && ActionBtn
      }

    </div>
  );
});
