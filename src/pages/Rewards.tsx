import React from 'react';
import { css } from '@emotion/css';
import { Button } from '../components/Button';

export const Rewards: React.FC = () => {
    const rewardsStyles = css`
        display: flex;
        flex-direction: column;
        padding: 16px 16px 0 16px;
        justify-content: space-between;
    `;

    const contentStyles = css`
        display: flex;
        flex-direction: column;
        margin-bottom:24px;
    `;

    const cardStyles = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20%;
        margin-bottom: 52px;
    `;

    const headerTitleStyles = css`
        text-align: center;
        font-family: "Chakra Petch";
        font-size: 26px;
        font-style: normal;
        font-weight: 600;
        line-height: 34px; /* 130.769% */
        color: #FFFFFF;
        margin-bottom: 8px;
    `;

    const headerSubtitleStyles = css`
        text-align: center;
        color: #F4F4F4A3;
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 125% */
    `;

    const dividerLineStyles = css`
        border-top: 1px solid var(--Stroke-Primary, #323232);
        margin: 0 -16px;
        width: calc(100% + 32px);
    `;

    const footerContainerStyles = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 12px;
    `;

    const footerTitleStyles = css`
        color: #FFFFFF;
        text-align: center;
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        margin-bottom:8px;
    `;

    const footerDescriptionStyles = css`
        font-family: "DM Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        margin-bottom:12px;
        color: #F4F4F4A3;
        text-align: center;
    `;

    const buttonContainerStyles = css`
        display: flex;
        justify-content: center;
        width: 100%;
    `;

    const secondaryButtonStyles = css`
        width: 100%;
    `;

    const handleSubscribe = () => {
        // Открыть Telegram канал
        window.open('https://t.me/frogprotocol', '_blank');
    };

    return (
        <div className={rewardsStyles}>
            <div className={contentStyles}>
                <div className={cardStyles}>
                    <span className={headerTitleStyles}>Leaderboard coming soon</span>
                    <span className={headerSubtitleStyles}>
                    You’re already earning points for trading volume and deposits. <br />
                    While the points and leaderboard aren’t visible yet, we’re tracking everything. <br />
                    You’ll soon be able to see your progress and compete for the top spots!
                    </span>
                </div>

                <div className={dividerLineStyles}></div>
            </div>

            <div className={footerContainerStyles}>
                <span className={footerTitleStyles}>Stay with Frog Protocol</span>
                <span className={footerDescriptionStyles}>
                Tap the button below to subscribe to our channel <br />
                and be the first to get updates, exclusive rewards, and leaderboard announcements. <br />
                Don’t miss out!
                </span>
                <div className={buttonContainerStyles}>
                    <Button
                        className={secondaryButtonStyles}
                        onClick={handleSubscribe}
                        fullWidth={true}
                        variant="secondary"
                    >
                        Subscribe to us
                    </Button>
                </div>
            </div>
        </div>
    );
};

