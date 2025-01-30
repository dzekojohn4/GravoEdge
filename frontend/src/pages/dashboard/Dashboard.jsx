import { useState } from "react"
import HealthIcon from "@/assets/icons/health.svg?react"
import EthIcon from "@/assets/icons/ethereum.svg?react"
import TelegramIcon from "@/assets/icons/telegram_dashboard.svg?react"
import Borrow from "@/components/dashboard/borrow/Borrow"
import Collateral from "@/components/dashboard/collateral/Collateral"
import DashboardTabs from "@/components/dashboard/dashboard-tab/DashboardTabs"
import Deposited from "@/components/dashboard/deposited/Deposited"
import { ActionModal } from "@/components/ui/action-modal"
import Card from "@/components/ui/card/Card"
import { Button } from "@/components/ui/custom-button/Button"
import Spinner from "@/components/ui/spinner/Spinner"
import { useCheckPosition, useClosePosition } from "@/hooks/useClosePosition"
import useDashboardData from "@/hooks/useDashboardData"
import useTelegramNotification from "@/hooks/useTelegramNotification"
import { useWalletStore } from "@/stores/useWalletStore"
import { DASHBOARD_TABS } from "@/utils/constants"
import DashboardLayout from "../DashboardLayout"

export default function DashboardPage({ telegramId }) {
  const { walletId } = useWalletStore()
  const [showModal, setShowModal] = useState(false)
  const handleOpen = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const { 
    cardData, 
    healthFactor, 
    startSum, 
    currentSum, 
    depositedData, 
    isLoading } = useDashboardData()
  const { mutate: closePositionEvent, isLoading: isClosing } = useClosePosition(walletId)
  const { data: positionData } = useCheckPosition()
  const { subscribe } = useTelegramNotification()

  const hasOpenedPosition = positionData?.has_opened_position
  const { COLLATERAL, BORROW, DEPOSITED } = DASHBOARD_TABS

  const handleSubscribe = () => subscribe({ telegramId, walletId })

  const [activeTab, setActiveTab] = useState(COLLATERAL)

  const getCurrentSumColor = () => {
    if (currentSum > startSum) return "current-sum-green"
    if (currentSum < startSum) return "current-sum-red"
    
    return "" //string
  }

  return (
    <DashboardLayout>
      {isLoading && <Spinner loading={isLoading} />}
      <div className="top-cards-dashboard">
        <Card label="Health Factor" value={healthFactor} icon={<HealthIcon className="icon" />} />
        <Card label="Borrow Balance" cardData={cardData} icon={<EthIcon className="icon" />} />
      </div>
      <div className="dashboard-info-container">
        <div className="dashboard-info-card">
          <DashboardTabs activeTab={activeTab} switchTab={setActiveTab} />

          {activeTab === COLLATERAL && (
            <Collateral
              getCurrentSumColor={getCurrentSumColor}
              startSum={startSum}
              currentSum={currentSum}
              data={cardData}
            />
          )}

          {activeTab === BORROW && <Borrow data={cardData} />}

          {activeTab === DEPOSITED && <Deposited data={depositedData} />}
        </div>
        <Button
          className="redeem-btn"
          variant="primary"
          size="lg"
          onClick={() => closePositionEvent()}
          disabled={isClosing || !hasOpenedPosition}
        >
          {isClosing ? "Closing..." : "Redeem"}
        </Button>
        <Button variant="secondary" size="lg" className="dashboard-btn telegram" onClick={handleOpen}>
          <TelegramIcon className="tab-icon" />
          Enable telegram notification bot
        </Button>
        {showModal && (
          <ActionModal
            isOpen={showModal}
            title="Telegram Notification"
            subTitle="Do you want to enable telegram notification bot?"
            content={[
              "This will allow you to receive quick notifications on your telegram line in realtime. You can disable this setting anytime.",
            ]}
            cancelLabel="Cancel"
            submitLabel="Yes, Sure"
            submitAction={handleSubscribe}
            cancelAction={handleClose}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

