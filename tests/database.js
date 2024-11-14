import test from 'ava';

test('mon test qui passe', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');
    t.is(await bar, 'pasbar');
});