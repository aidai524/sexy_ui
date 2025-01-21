import { defaultAvatar } from "@/app/utils/config"
export const mockTraders = [
    {
      avatar: defaultAvatar,
      name: "Party Girl",
      followers: 245,
      roi: 830.6,
      pnl: {
        "1d": 3.5,
        "7d": 12.3,
        "30d": 35.8
      },
      profit: {
        "1d": "364.16",
        "7d": "1,247.32",
        "30d": "3,842.55"
      }
    },
    {
      avatar: defaultAvatar,
      name: "0xBaddies",
      followers: 245,
      roi: 725.4,
      pnl: {
        "1d": 2.3,
        "7d": 8.7,
        "30d": 28.4
      },
      profit: {
        "1d": "364.16",
        "7d": "986.45",
        "30d": "2,967.23"
      }
    },
    {
      avatar: defaultAvatar,
      name: "adbo235",
      followers: 245,
      roi: 654.2,
      pnl: {
        "1d": 1.7,
        "7d": 6.5,
        "30d": 22.1
      },
      profit: {
        "1d": "364.16",
        "7d": "754.28",
        "30d": "2,345.67"
      }
    },
    {
      avatar: defaultAvatar,
      name: "CryptoKing",
      followers: 245,
      roi: 589.3,
      pnl: {
        "1d": 1.2,
        "7d": 5.4,
        "30d": 18.9
      },
      profit: {
        "1d": "364.16",
        "7d": "645.32",
        "30d": "1,987.45"
      }
    },
    {
      avatar: defaultAvatar,
      name: "Trademaster",
      followers: 245,
      roi: 498.7,
      pnl: {
        "1d": 789.6,
        "7d": 4.2,
        "30d": 15.6
      },
      profit: {
        "1d": "364.16",
        "7d": "534.21",
        "30d": "1,645.78"
      }
    },
    {
      avatar: defaultAvatar,
      name: "WhaleAlert",
      followers: 245,
      roi: 423.5,
      pnl: {
        "1d": 630.6,
        "7d": 3.8,
        "30d": 12.4
      },
      profit: {
        "1d": "364.16",
        "7d": "456.78",
        "30d": "1,234.56"
      }
    }
  ]
  
  export const fetchMockTraders = (sort: string, order: 'asc' | 'desc' = 'desc') => {
    let sortedTraders = JSON.parse(JSON.stringify(mockTraders))
  
    sortedTraders.sort((a: any, b: any) => {
      let valueA, valueB
  
      if (sort === 'roi') {
        valueA = a.roi
        valueB = b.roi
      } else {
        valueA = a.pnl[sort]
        valueB = b.pnl[sort]
      }
  
      return order === 'desc' ? valueB - valueA : valueA - valueB
    })
  
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sortedTraders)
      }, 500)
    })
  }