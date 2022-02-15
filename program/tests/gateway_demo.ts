import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { GatewayDemo } from '../target/types/gateway_demo';

describe('gateway_demo', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.GatewayDemo as Program<GatewayDemo>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
