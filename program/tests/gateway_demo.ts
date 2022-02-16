import * as anchor from '@project-serum/anchor';
import {Program} from '@project-serum/anchor';
import {GatewayDemo} from '../target/types/gateway_demo';

describe('gateway_demo', () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());

    const program = anchor.workspace.GatewayDemo as Program<GatewayDemo>;

    it('Successfully Transfers', async () => {
        // Add your test here.
        const tx = await program.rpc.transfer(new anchor.BN(1000000), {
            accounts: {
                gatewayToken: '6WzGMErZA82ewPjJQaBxH5t5WTqhKGcM4zRDHUSUDrq5',
                payer: 'MWmXkNMtKbkeVUYMfMsueDhREHeRWrfrmjF2y3hL6gB',
                recipient: '4vdYJukzVFDzuMNXvzM6CcaEvhoSsA3LuDdccPnEsNBi',
                systemProgram: '11111111111111111111111111111111'
            },

        });
        console.log("Your transaction signature", tx);
    });
});