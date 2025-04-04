import React, { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext();
export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    const produtoFormatado = {
      ...produto,
      preco: Number(produto.preco),
      quantidade: produto.quantidade || 1,
    };

    setCarrinho((prev) => {
      const existente = prev.find((p) => p.id === produtoFormatado.id);
      if (existente) {
        return prev.map((p) =>
          p.id === produtoFormatado.id
            ? { ...p, quantidade: p.quantidade + produtoFormatado.quantidade }
            : p
        );
      }
      return [...prev, produtoFormatado];
    });
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    setCarrinho((prev) => {
      if (novaQuantidade <= 0) {
        // Remove do carrinho
        return prev.filter((item) => item.id !== id);
      }
      // Atualiza quantidade
      return prev.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      );
    });
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        atualizarQuantidade,
        removerDoCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
