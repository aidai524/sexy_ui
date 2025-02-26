import React, { useState } from 'react'
import styles from './index.module.css'
import Modal from '@/app/components/modal'
import {Checkbox} from 'antd-mobile'
import { numberFormatter } from '@/app/utils/common';
import { formatDateTime } from '@/app/utils/index';
import Big from 'big.js'
import TopTraderShareModal from '@/app/sections/smart/components/TopTraderShare/modal';
import { useUserAgent } from '@/app/context/user-agent';
import CloseIcon from "@/app/components/icons/modal-close";


export default function TopTraderDetailShareConfirm({ show, onClose, smartMoniesInfo, copyTradersUserInfo, currentUserInfo, shareName }: any) {
    const { isMobile } = useUserAgent();
    const [selectedItems, setSelectedItems] = useState<Record<string, {value?: boolean; useValue?: any; title?: string; useValueCurrency?: string; useWhite?: boolean; useExtraValue?: string}>>({});
    const [showShare, setShowShare] = useState(false);
    const handleCheckboxChange = (key: string, value: any) => {
      setSelectedItems(prev => ({
        ...prev,
        [key]: value
      }));
    };

    const formatPnl = (pnl: string) => {
      if (pnl == '0') {
        return '0';
      }
      if (pnl.startsWith('-')) {
        return '-' + numberFormatter(Math.abs(Number(pnl)), 2, true);
      }
      return '+' + numberFormatter(pnl, 2, true);
  }

  const formatWinRate = (winRate: string) => {
    if (winRate == '0') {
      return '0%';
    }
    return new Big(winRate).times(100).toFixed(1) + '%';
  }

  const isGtZero = (str: string) => {
    return Number(str) >= 0;
  };

  const handleSelectAll = (checked: boolean) => {
      if (!checked) {
        const allItems = {
          pnl1D: {value: checked},
          winRate1D: {value: checked},
          pnl7D: {value: checked},
          winRate7D: {value: checked},
          pnl30D: {value: checked},
          winRate30D: {value: checked},
          buySell: {value: checked},
          lastTradeAt: {value: checked},
          copiers: {value: checked},
          totalPnl: {value: checked}
      };
        setSelectedItems(allItems); 
        return;
    }
    const allItems = {
        pnl1D: {value: checked, useValue: formatPnl(smartMoniesInfo?.pnl1D || '0'), title: '1D PnL', useValueCurrency: 'SOL', useGreen: isGtZero(smartMoniesInfo?.pnl1D || '0')},
        winRate1D: {value: checked, useValue: formatWinRate(smartMoniesInfo?.winRate1D || '0'), title: '1D Win Rate', useWhite: true},
        pnl7D: {value: checked, useValue: formatPnl(smartMoniesInfo?.pnl7D || '0'), title: '7D PnL', useValueCurrency: 'SOL', useGreen: isGtZero(smartMoniesInfo?.pnl7D || '0')},
        winRate7D: {value: checked, useValue: formatWinRate(smartMoniesInfo?.winRate7D || '0'), title: '7D Win Rate', useWhite: true},
        pnl30D: {value: checked, useValue: formatPnl(smartMoniesInfo?.pnl30D || '0'), title: '30D PnL', useValueCurrency: 'SOL', useGreen: isGtZero(smartMoniesInfo?.pnl30D || '0')},
        winRate30D: {value: checked, useValue: formatWinRate(smartMoniesInfo?.winRate30D || '0'), title: '30D Win Rate', useWhite: true},
        buySell: {
          value: checked, 
          useValue: `${copyTradersUserInfo?.tradeInfo?.buys || 0}`, 
          useExtraValue: ` / ${copyTradersUserInfo?.tradeInfo?.sells || 0}`,
          title: 'Buy/Sell',
          useGreen: true
        },
        lastTradeAt: {value: checked, useValue: formatDateTime(smartMoniesInfo?.lastTradeAt || 0), title: 'Last Trade', useWhite: true},
        copiers: {value: checked, useValue: copyTradersUserInfo?.copiers?.length || 0, title: 'Copy Traders',useGreen: true},
        totalPnl: {value: checked, useValue: formatPnl(copyTradersUserInfo?.totalPnl || '0'), title: 'Copy Cohort PnL', useValueCurrency: 'SOL', useGreen: isGtZero(copyTradersUserInfo?.totalPnl || '0')}
      };
      setSelectedItems(allItems);
    };
      const isAllSelected = () => {
        const selectedValues = Object.values(selectedItems);
        return selectedValues.length == 10 && selectedValues.every(item => item.value);
      };

      const modalConfig = isMobile ? {
        animation: 'popup',
        closeStyle: { display: "none" }
      } : {
        closeStyle:{ display: "none" },
        maskClose:false
      };
      
  return (
   <>
     <Modal
      open={show}
      onClose={onClose}
      {...modalConfig}
    >
      <div className={isMobile ? styles.main : styles.mainPC}>
     {!isMobile &&  <div
                  onClick={onClose}
                  className={styles.CloseButton}
                >
                  <CloseIcon size={35} />
                </div>}
        <div className={styles.titleText}>
          <span>Shared Data</span>
         <div className={styles.selectAll + ' ' + 'global-checkbox-container'}>
          <Checkbox checked={isAllSelected()} onChange={(val) => handleSelectAll(val)}></Checkbox>
          <span className={styles.selectAllText}>select all</span>
         </div>
        </div>
            
        
        <div className={styles.grid}>
         <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['pnl1D']?.value}
                onChange={(val) => handleCheckboxChange('pnl1D', {value: val, useValue: formatPnl(smartMoniesInfo?.pnl1D || '0'), title: '1D PnL', useValueCurrency: 'SOL', useGreen: isGtZero(smartMoniesInfo?.pnl1D || '0')})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>1D PnL</div>
                <div className={styles.value}>
                <span className={isGtZero(smartMoniesInfo?.pnl1D || '0') ? styles.profit : styles.profitLessThanZero}>{formatPnl(smartMoniesInfo?.pnl1D || '0')}</span> 
                <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>
          
          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['winRate1D']?.value}
                onChange={(val) => handleCheckboxChange('winRate1D', {value: val, useValue: formatWinRate(smartMoniesInfo?.winRate1D || '0'), title: '1D Win Rate', useWhite: true})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>1D Win Rate</div>
                <div className={styles.value}>{formatWinRate(smartMoniesInfo?.winRate1D || '0')}</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['pnl7D']?.value}
                onChange={(val) => handleCheckboxChange('pnl7D', {value: val, useValue: formatPnl(smartMoniesInfo?.pnl7D || '0'), title: '7D PnL', useValueCurrency: 'SOL', useGreen: isGtZero(smartMoniesInfo?.pnl7D || '0')})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>7D PnL</div>
                <div className={styles.value}>
                <span className={isGtZero(smartMoniesInfo?.pnl7D || '0') ? styles.profit : styles.profitLessThanZero}>{formatPnl(smartMoniesInfo?.pnl7D || '0')}</span> 
                <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['winRate7D']?.value}
                onChange={(val) => handleCheckboxChange('winRate7D', {value: val, useValue: formatWinRate(smartMoniesInfo?.winRate7D || '0'), title: '7D Win Rate', useWhite: true})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>7D Win Rate</div>
                <div className={styles.value}>{formatWinRate(smartMoniesInfo?.winRate7D || '0')}</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['pnl30D']?.value}
                onChange={(val) => handleCheckboxChange('pnl30D', {value: val, useValue: formatPnl(smartMoniesInfo?.pnl30D || '0'), title: '30D PnL', useValueCurrency: 'SOL', useGreen: isGtZero(smartMoniesInfo?.pnl30D || '0')})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>30D PnL</div>
                <div className={styles.value}>
                <span className={isGtZero(smartMoniesInfo?.pnl30D || '0') ? styles.profit : styles.profitLessThanZero}>{formatPnl(smartMoniesInfo?.pnl30D || '0')}</span> 
                <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['winRate30D']?.value}
                onChange={(val) => handleCheckboxChange('winRate30D', {value: val, useValue: formatWinRate(smartMoniesInfo?.winRate30D || '0'), title: '30D Win Rate', useWhite: true})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>30D Win Rate</div>
                <div className={styles.value}>{formatWinRate(smartMoniesInfo?.winRate30D || '0')}</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['buySell']?.value}
                onChange={(val) => handleCheckboxChange('buySell', {
                  value: val, 
                  useValue: `${copyTradersUserInfo?.tradeInfo?.buys || 0}`, 
                  useExtraValue: ` / ${copyTradersUserInfo?.tradeInfo?.sells || 0}`,
                  title: 'Buy/Sell',
                  useGreen: true
                })}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Buy/Sell</div>
                <div className={styles.value}>
                    <span className={styles.buy}>{copyTradersUserInfo?.tradeInfo?.buys || 0}</span>
                    <span className={styles.divider}>/</span>
                    <span className={styles.sell}>{copyTradersUserInfo?.tradeInfo?.sells || 0}</span>
                </div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['lastTradeAt']?.value}
                onChange={(val) => handleCheckboxChange('lastTradeAt', {value: val, useValue: formatDateTime(smartMoniesInfo?.lastTradeAt || 0), title: 'Last Trade', useWhite: true})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Last Trade</div>
                <div className={styles.value}>{formatDateTime(smartMoniesInfo?.lastTradeAt || 0)}</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['copiers']?.value}
                onChange={(val) => handleCheckboxChange('copiers', {value: val, useValue: copyTradersUserInfo?.copiers?.length || 0, title: 'Copy Traders', useGreen: true})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Copy Traders</div>
                <div className={styles.value}>{copyTradersUserInfo?.copiers?.length || 0}</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['totalPnl']?.value}
                onChange={(val) => handleCheckboxChange('totalPnl', {value: val, useValue: formatPnl(copyTradersUserInfo?.totalPnl || '0'), title: 'Copy Cohort PnL', useValueCurrency: 'SOL', useGreen: isGtZero(copyTradersUserInfo?.totalPnl || '0')})}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Copy Cohort PnL</div>
                <div className={styles.value}>
                    <span className={isGtZero(copyTradersUserInfo?.totalPnl || '0') ? styles.profit : styles.profitLessThanZero}>{formatPnl(copyTradersUserInfo?.totalPnl || '0')}</span>
                    <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
            <div className={styles.button} onClick={() => setShowShare(true)}>Confirm</div>
        </div>
      </div>
    </Modal>
    <TopTraderShareModal shareName={shareName} show={showShare} onClose={() => setShowShare(false)} selectedItems={selectedItems} currentUserInfo={currentUserInfo} />
   </>
  )
}


