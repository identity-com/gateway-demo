use anchor_lang::prelude::*;

declare_id!("Cq18woAS5xVXb6Ci24pxk6f1ptLx4h3HHcxm12LZPt1e");

#[program]
pub mod gateway_demo {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
