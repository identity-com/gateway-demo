use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use solana_gateway::Gateway;
declare_id!("Cq18woAS5xVXb6Ci24pxk6f1ptLx4h3HHcxm12LZPt1e");

// The gatekeeper network public key
const GATEKEEPER_NETWORK_KEY: &[u8] = &[13, 61, 157, 22, 194, 40, 43, 49, 99, 194, 219, 188, 124,
    255, 19, 26, 214, 194, 38, 153, 38, 196, 18, 104, 220, 215, 105, 41, 71, 156, 6, 66];

#[program]
pub mod gateway_demo {
    use super::*;

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> ProgramResult {
        let gatekeeper = Pubkey::new(GATEKEEPER_NETWORK_KEY);
        let gateway_token = &ctx.accounts.gateway_token;
        let payer = &ctx.accounts.payer;
        let recipient = &ctx.accounts.recipient;

        msg!(
            "Verifying gateway token {} on network {} belongs to {}",
            gateway_token.key,
            gatekeeper,
            payer.key()
        );

        Gateway::verify_gateway_token_account_info(
            &gateway_token,
            &payer.key(),
            &gatekeeper,
            None,
        )?;

        msg!(
            "Sending {} lamports from {} to {}",
            amount,
            payer.key(),
            recipient.key
        );

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &payer.key(),
            &recipient.key,
            amount,
        );

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                payer.to_account_info(),
                recipient.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account()]
    gateway_token: AccountInfo<'info>,
    #[account(mut)]
    payer: Signer<'info>,
    #[account(mut)]
    recipient: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}
