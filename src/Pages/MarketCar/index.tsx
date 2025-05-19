'use client';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './MarketCarPages.css';

interface ICurso {
    id: number;
    titulo: string;
    preco: number;
    imagem: string;
}

interface IShoppingItem {
    produto: ICurso;
    quantidade: number;
}

const Cursos: ICurso[] = [
    {id: 1, titulo: "Informática Básica", preco: 519.99, imagem: "/images/informatica-basica.jpg"},
    {id: 2, titulo: "Mecânico de Motocicletas", preco: 699.99, imagem: "/images/mecanico-motocicletas.jpg"},
    {id: 3, titulo: "Eletricista Predial", preco: 999.99, imagem: "/images/eletricista-predial.jpg"},
    {id: 4, titulo: "Auxiliar Administrativo", preco: 424.99, imagem: "/images/auxiliar-administrativo.jpg"},
    {id: 5, titulo: "Mecânico Automotivo", preco: 919.99, imagem: "/images/mecanico-automotivo.jpg"},
    {id: 6, titulo: "Redes de Computadores", preco: 614.99, imagem: "/images/redes-computadores.jpg"},
    {id: 7, titulo: "Programação em Python", preco: 829.99, imagem: "/images/programacao-python.jpg"},
    {id: 8, titulo: "Soldador Industrial", preco: 1149.99, imagem: "/images/soldador-industrial.jpg"},
    {id: 9, titulo: "Técnicas de Vendas", preco: 329.99, imagem: "/images/tecnicas-vendas.jpg"},
    {id: 10, titulo: "Fotografia Digital", preco: 579.99, imagem: "/images/fotografia-digital.jpg"},
    {id: 11, titulo: "Design Gráfico", preco: 789.99, imagem: "/images/design-grafico.jpg"},
    {id: 12, titulo: "Manutenção de Computadores", preco: 649.99, imagem: "/images/manutencao-computadores.jpg"},
];

const MarketCarPages = () => {
    const [shoppingCursos, setShoppingCursos] = useState<IShoppingItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCursos, setFilteredCursos] = useState<ICurso[]>(Cursos);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleAddCurso = (id: number) => {
        const curso = Cursos.find((curso) => curso.id === id);
        const existeShoppingCurso = shoppingCursos.find((item) => item.produto.id === id);

        if (existeShoppingCurso) {
            const newShoppingCurso: IShoppingItem[] = shoppingCursos.map(item => {
                if (item.produto.id === id) {
                    return {
                        ...item,
                        quantidade: item.quantidade + 1,
                    };
                }
                return item;
            });
            setShoppingCursos(newShoppingCurso);
            return;
        }

        const carItem: IShoppingItem = {
            produto: curso!,
            quantidade: 1,
        };

        const newShoppingCurso: IShoppingItem[] = [...shoppingCursos, carItem];
        setShoppingCursos(newShoppingCurso);
    };

    const handleRemoveCurso = (id: number) => {
        const cursoIndex = shoppingCursos.findIndex(item => item.produto.id === id);

        if (cursoIndex !== -1) {
            const cursoItem = shoppingCursos[cursoIndex];

            if (cursoItem.quantidade >= 1) {
                const removeShoppingCurso = shoppingCursos.filter((_, index) => index !== cursoIndex);
                setShoppingCursos(removeShoppingCurso);
            }
        }
    };

    const handleRemoveOneCurso = (id: number) => {
        const updatedShoppingCursos = shoppingCursos.map(item => {
            if (item.produto.id === id && item.quantidade > 1) {
                return { ...item, quantidade: item.quantidade - 1 };
            }
            if (item.produto.id === id && item.quantidade === 1) {
                return null;
            }
            return item;
        }).filter(item => item !== null) as IShoppingItem[];

        setShoppingCursos(updatedShoppingCursos);
    };

    const totalCursos = shoppingCursos.reduce((total, precoAtual) => {
        return total + precoAtual.produto.preco * precoAtual.quantidade;
    }, 0);

    const totalItems = shoppingCursos.reduce((total, item) => total + item.quantidade, 0);

    const generatePrintContent = () => {
        const cartContent = shoppingCursos.map(item => `
            <tr>
                <td>${item.produto.titulo}</td>
                <td>${item.quantidade}</td>
                <td>R$${item.produto.preco.toFixed(2)}</td>
                <td>R$${(item.quantidade * item.produto.preco).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .total {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h1>Nota Fiscal</h1>
                <p>Total de Itens: ${totalItems}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartContent}
                    </tbody>
                    <tfoot>
                        <tr class="total">
                            <td colspan="3">Total Geral</td>
                            <td>R$${totalCursos.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </body>
            </html>
        `;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(generatePrintContent());
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toUpperCase();
        setSearchTerm(term);
        const filtered = Cursos.filter(curso => curso.titulo.toUpperCase().includes(term));
        setFilteredCursos(filtered);
    };

    return (
        <div className="market-page">
            {/* Botão com ícone para abrir o carrinho */}
            <button className="show-cart-button" onClick={() => setModalIsOpen(true)}>
                <FontAwesomeIcon icon={faShoppingCart} size="2x" />
            </button>

            {/* Modal do carrinho */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Carrinho de Compras"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h1>Carrinho de Compras <hr /> (Total: R${totalCursos.toFixed(2)})</h1>
                <button className="print-button" onClick={handlePrint}>Imprimir Carrinho</button>
                <button className="close-modal-button" onClick={() => setModalIsOpen(false)}>Fechar</button>
                <div className="cart-list">
                    {shoppingCursos.map((item) => (
                        <div key={item.produto.id} className="cart-item">
                            <p className="cart-title">Produto: {item.produto.titulo}</p>
                            <p className="cart-quantity">Quantidade: {item.quantidade}</p>
                            <p className="cart-price">Preço: R${item.produto.preco.toFixed(2)}</p>
                            <p className="cart-total">Total: R${(item.quantidade * item.produto.preco).toFixed(2)}</p>
                            <button className="remove-one-button" onClick={() => handleRemoveOneCurso(item.produto.id)}>Remover 1</button>
                            <button className="remove-all-button" onClick={() => handleRemoveCurso(item.produto.id)}>Remover Tudo</button>
                        </div>
                    ))}
                </div>
            </Modal>

            <div className="curso-list-container">
                <h1>CURSOS SENAI 2024</h1>
                <input
                    type="text"
                    placeholder="BUSCAR CURSOS..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="curso-list">
                    {filteredCursos.map((curso) => (
                        <div key={curso.id} className="curso-item">
                            <img src={curso.imagem} alt={curso.titulo} className="curso-image" />
                            <div className="curso-details">
                                <h2 className="curso-title">{curso.titulo}</h2>
                                <p className="curso-price">R${curso.preco.toFixed(2)}</p>
                                <button onClick={() => handleAddCurso(curso.id)}>Adicionar ao Carrinho</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketCarPages;
