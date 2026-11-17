import { renderHook, act } from "@testing-library/react";
import { CarrinhoProvider, useCarrinho } from "./CarrinhoContext";

const wrapper = ({ children }) => <CarrinhoProvider>{children}</CarrinhoProvider>;
const iphone = { id: 1, marca: "Apple", modelo: "iPhone 15", preco: "699.99" };
const pixel = { id: 2, marca: "Google", modelo: "Pixel 7", preco: 549 };

function montarCarrinho() {
  return renderHook(() => useCarrinho(), { wrapper }).result;
}

describe("CarrinhoContext", () => {
  test("começa vazio", () => {
    const carrinho = montarCarrinho();
    expect(carrinho.current.carrinho).toEqual([]);
  });

  test("adiciona um produto com quantidade 1 e converte o preço para número", () => {
    const carrinho = montarCarrinho();
    act(() => carrinho.current.adicionarAoCarrinho(iphone));

    expect(carrinho.current.carrinho).toHaveLength(1);
    expect(carrinho.current.carrinho[0]).toMatchObject({ id: 1, quantidade: 1, preco: 699.99 });
  });

  test("adicionar o mesmo produto soma a quantidade em vez de duplicar", () => {
    const carrinho = montarCarrinho();
    act(() => carrinho.current.adicionarAoCarrinho(iphone));
    act(() => carrinho.current.adicionarAoCarrinho({ ...iphone, quantidade: 2 }));

    expect(carrinho.current.carrinho).toHaveLength(1);
    expect(carrinho.current.carrinho[0].quantidade).toBe(3);
  });

  test("atualiza a quantidade de um produto", () => {
    const carrinho = montarCarrinho();
    act(() => carrinho.current.adicionarAoCarrinho(iphone));
    act(() => carrinho.current.atualizarQuantidade(1, 5));

    expect(carrinho.current.carrinho[0].quantidade).toBe(5);
  });

  test("quantidade 0 ou negativa remove o produto", () => {
    const carrinho = montarCarrinho();
    act(() => carrinho.current.adicionarAoCarrinho(iphone));
    act(() => carrinho.current.atualizarQuantidade(1, 0));

    expect(carrinho.current.carrinho).toEqual([]);
  });

  test("remove apenas o produto indicado", () => {
    const carrinho = montarCarrinho();
    act(() => carrinho.current.adicionarAoCarrinho(iphone));
    act(() => carrinho.current.adicionarAoCarrinho(pixel));
    act(() => carrinho.current.removerDoCarrinho(1));

    expect(carrinho.current.carrinho.map((p) => p.id)).toEqual([2]);
  });

  test("limpar esvazia o carrinho", () => {
    const carrinho = montarCarrinho();
    act(() => carrinho.current.adicionarAoCarrinho(iphone));
    act(() => carrinho.current.adicionarAoCarrinho(pixel));
    act(() => carrinho.current.limparCarrinho());

    expect(carrinho.current.carrinho).toEqual([]);
  });
});
