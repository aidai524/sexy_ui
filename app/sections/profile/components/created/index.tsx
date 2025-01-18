import { useCallback, useEffect, useRef, useState } from "react";
import Token from "../token";
import { http, httpGet } from "@/app/utils";
import Empty from "@/app/components/empty";
import type { Project } from "@/app/type";
import { mapDataToProject } from "@/app/utils/mapTo";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";
import { useAuth } from "@/app/context/auth";
import useCheckFliped from "../../hooks/use-check-fliped";
import { useHomeTab } from "@/app/store/useHomeTab";
import styles from "./index.module.css";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/app/components/popover";
import { useDebounceFn } from "ahooks";
import { useUserAgent } from "@/app/context/user-agent";

const urls: Record<string, string> = {
  created: "/project/account/list",
  flipped: "/project/pre_paid/list",
  liked: "/project/like/list"
};

const LIMIT = 10;

interface Summary {
  amount?: number;
  label: string;
  value: number | "";
}

const SUMMARIES_DEFAULT: Record<string, Summary[]> = {
  liked: [
    { label: "All", amount: 0, value: "" },
    { label: "Launched", amount: 0, value: 3 },
    { label: "Launching", amount: 0, value: 1 },
    { label: "Pre-Launch", amount: 0, value: 0 }
  ]
};

export default function Created({
  address,
  type,
  prepaidWithdrawDelayTime,
  from,
  isOther,
  hideHot = false,
  refresher = 0,
  isCurrent
}: any) {
  const popoverRef = useRef<any>();
  const homeTabStore: any = useHomeTab();
  const [summaries, setSummaries] = useState<Record<string, Summary[]>>(SUMMARIES_DEFAULT);
  const [list, setList] = useState<Project[]>([]);
  const [refresh, setRefresh] = useState<number>(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { updateCurrentUserInfo, accountRefresher, userInfo } = useAuth();
  const timerRef = useRef<any>();
  const { unfliped } = useCheckFliped(list, isOther);

  useEffect(() => {
    if (address && userInfo?.address !== address) {
      loadMore(true);
    }
    if (!address) {
      setList([]);
    }
  }, [address]);

  useEffect(() => {
    if (refresher || accountRefresher) {
      loadMore(true);
    }
  }, [refresher, accountRefresher]);

  const loadMore = useCallback(
    async (
      isInit?: boolean,
      limit?: number,
      opts?: { status?: "" | number }
    ) => {
      setLoading(true);
      try {
        const params: any = {
          address,
          limit: limit || LIMIT,
          offset: isInit ? 0 : offset
        };

        let _summary: any = homeTabStore.currentSummary?.value;
        if (typeof opts?.status !== 'undefined') {
          _summary = opts?.status;
        }
        if (type === "liked" && typeof _summary !== "undefined") {
          params.project_status = _summary;
        }
        const res = await http(urls[type], "GET", params, {});
        if (!res) {
          setLoading(false);
          if (isInit) {
            setList([]);
          }
          return;
        }
        setHasMore(res.data?.has_next_page || false);
        let _list: any = [];
        if (res.code !== 0 || !res.data?.list?.length) {
          setLoading(false);
          if (isInit) {
            setList([]);
          }
          return;
        }

        const newMapList = res.data?.list.map(mapDataToProject);

        _list = isInit ? newMapList : [...list, ...newMapList];

        setOffset(_list.length);
        setList(_list);
        clearTimeout(timerRef.current);
        if (type === "liked") {
          const _summaries: Summary[] = [
            { label: "All", amount: res.data.total_num || 0, value: "" },
            { label: "Launched", amount: res.data.launched_num || 0, value: 3 },
            {
              label: "Launching",
              amount: res.data.launching_num || 0,
              value: 1
            },
            {
              label: "Pre-Launch",
              amount: res.data.pre_launch_num || 0,
              value: 0
            }
          ];
          setSummaries({
            ...summaries,
            liked: _summaries
          });
          let _currentSummary: Summary | undefined;
          if (typeof _summary === "number") {
            _currentSummary = _summaries.find(
              (s) => s.value === _summary
            );
          }
          if (!_currentSummary) {
            _currentSummary = _summaries[0];
          }
          homeTabStore.set({ currentSummary: _currentSummary });
        }
        if (isCurrent) {
          timerRef.current = setTimeout(() => {
            loadMore(true, _list.length);
          }, 1000 * 60 * 1);
        }
      } catch (err) {
        console.log(
          '%cLoad <%s> list failed: %o',
          'background: #FF2BA0;color:#fff;font-size:16px;',
          urls[type],
          err,
        );
        setList([]);
      }
      setLoading(false);
    },
    [address, type, offset, list, isCurrent, loading]
  );

  // fix#REF-9400
  const { run: loadMoreDelay } = useDebounceFn(loadMore, { wait: 5000 });

  const handleSelect = (summary: Summary) => {
    popoverRef.current?.onClose?.();
    if (summary.label === homeTabStore.currentSummary?.label || loading) {
      return;
    }
    homeTabStore.set({ currentSummary: summary });
    loadMore(true, LIMIT, { status: summary.value });
  };

  useEffect(() => {
    setSummaries(SUMMARIES_DEFAULT);
    homeTabStore.set({ currentSummary: SUMMARIES_DEFAULT[0] });

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isCurrent) {
      timerRef.current = setTimeout(() => {
        loadMore(true, list.length);
      }, 3000);
    }
  }, [isCurrent]);

  if (list.length === 0) {
    return (
      <>
        <StatusSelect
          type={type}
          popoverRef={popoverRef}
          summaries={summaries}
          currentSummary={homeTabStore.currentSummary}
          handleSelect={handleSelect}
        />
        <div style={{ paddingTop: 116 }}>
          <Empty text={"No Fun coins " + type + " yet"} id={type} />
        </div>
      </>
    );
  }

  return (
    <div>
      <StatusSelect
        type={type}
        popoverRef={popoverRef}
        summaries={summaries}
        currentSummary={homeTabStore.currentSummary}
        handleSelect={handleSelect}
      />
      <div className={from === "page" ? styles.PcListWrapper : ""}>
        {list.map((item) => {
          const isSuperLike = !isOther
            ? item.isSuperLike
            : !unfliped?.includes(item.address);

          return (
            <Token
              from={from}
              data={{ ...item, isSuperLike }}
              isOther={isOther}
              key={item.id}
              hideHot={hideHot}
              prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
              update={() => {
                setRefresh(refresh + 1);
                updateCurrentUserInfo();
              }}
              onWithdrawSuccess={async () => {
                loadMoreDelay(true, LIMIT);
              }}
            />
          );
        })}
      </div>

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

const StatusSelect = (props: any) => {
  const { type, popoverRef, summaries, currentSummary, handleSelect } = props;
  const { isMobile } = useUserAgent();
  if (type !== "liked") return null;

  return (
    <div
      className={isMobile ? styles.SelectContainerMobile : styles.SelectContainer}
      style={{
        backgroundColor: isMobile ? "rgba(255, 255, 255, 0.08)" : "transparent"
      }}
    >
      <Popover
        ref={popoverRef}
        placement={PopoverPlacement.Bottom}
        trigger={PopoverTrigger.Click}
        content={
          <div className={styles.SelectDropdown}>
            <ul className={styles.SelectList}>
              {summaries.liked.map((s: any, idx: any) => (
                <li
                  key={idx}
                  className={
                    currentSummary?.label === s.label
                      ? styles.SelectItemActive
                      : styles.SelectItem
                  }
                  onClick={() => handleSelect(s)}
                >
                  <div className={styles.SelectItemLeft}>{s.label}</div>
                  <div className={styles.SelectItemRight}>{s.amount}</div>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <div className={styles.Select}>
          <div className={styles.SelectValue}>
            {currentSummary?.label || "All"} {currentSummary?.amount || "0"}
          </div>
          <div className={styles.SelectArrow}>
            <svg
              width="11"
              height="7"
              viewBox="0 0 11 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.8335 1L5.50016 5L1.16683 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </Popover>
    </div>
  );
};
