import React, { useState } from 'react'
import styles from './index.module.css'
import Modal from '@/app/components/modal'
import {Checkbox} from 'antd-mobile'

export default function TopTraderDetailShareConfirm({ show, onClose }: any) {
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

    const handleCheckboxChange = (key: string, value: any) => {
      setSelectedItems(prev => ({
        ...prev,
        [key]: value
      }));
    };
    console.log(selectedItems)
  return (
    <Modal
      open={show}
      onClose={onClose}
      animation="popup"
      closeStyle={{ display: "none" }}
    >
      <div className={styles.main}>
        
        <div className={styles.titleText}>Shared Data</div>
            
        
        <div className={styles.grid}>
         <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['pnl1D']}
                onChange={(val) => handleCheckboxChange('pnl1D', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>1D PnL</div>
                <div className={styles.value}>
                <span className={styles.profit}>+14.16</span> 
                <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>
          
          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['winRate1D']}
                onChange={(val) => handleCheckboxChange('winRate1D', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>1D Win Rate</div>
                <div className={styles.value}>50.6%</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['pnl7D']}
                onChange={(val) => handleCheckboxChange('pnl7D', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>7D PnL</div>
                <div className={styles.value}>
                <span className={styles.profit}>+164.16</span> 
                <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['winRate7D']}
                onChange={(val) => handleCheckboxChange('winRate7D', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>7D Win Rate</div>
                <div className={styles.value}>250.6%</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['pnl30D']}
                onChange={(val) => handleCheckboxChange('pnl30D', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>30D PnL</div>
                <div className={styles.value}>
                <span className={styles.profit}>+244.16</span> 
                <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['winRate30D']}
                onChange={(val) => handleCheckboxChange('winRate30D', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>30D Win Rate</div>
                <div className={styles.value}>150.6%</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['buySell']}
                onChange={(val) => handleCheckboxChange('buySell', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Buy/Sell</div>
                <div className={styles.value}>
                    <span className={styles.buy}>40</span>
                    <span>/</span>
                    <span className={styles.sell}>22</span>
                </div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['lastTradeAt']}
                onChange={(val) => handleCheckboxChange('lastTradeAt', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Last Trade</div>
                <div className={styles.value}>2025-02-14 19:06</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['copiers']}
                onChange={(val) => handleCheckboxChange('copiers', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Copy Traders</div>
                <div className={styles.value}>125</div>
            </div>
          </div>

          <div className={styles.checkboxContainer + ' ' + 'global-checkbox-container'}>
            <Checkbox
                checked={selectedItems['totalPnl']}
                onChange={(val) => handleCheckboxChange('totalPnl', val)}
            ></Checkbox>
            <div className={styles.item}>
                <div className={styles.label}>Copy Cohort PnL</div>
                <div className={styles.value}>
                    <span className={styles.profit}>523.44</span>
                    <span className={styles.currency}>SOL</span>
                </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
            <div className={styles.button}>Confirm</div>
        </div>
      </div>
    </Modal>
  )
}
