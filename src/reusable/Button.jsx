import React from "react";

/**
 * Komponen tombol reusable dengan varian.
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - Varian tombol
 * @param {React.ReactNode} props.children - Konten tombol (teks, ikon, dll.)
 * @param {string} [props.className] - Class Tailwind tambahan
 * @param {function} props.onClick - Fungsi saat tombol diklik
 * @param {boolean} [props.disabled] - Status disabled tombol
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Tipe tombol HTML
 */
const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props // Menyebarkan props lain (spt. 'aria-label')
}) => {
  // Styles dasar yang berlaku untuk semua varian
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-150 ease-in-out " +
    "flex items-center justify-center gap-2 " + // Memudahkan penambahan ikon
    "focus:outline-none focus:ring-2 focus:ring-offset-2 " + // Aksesibilitas
    "disabled:opacity-50 disabled:cursor-not-allowed"; // Disabled state

  // Styles spesifik untuk tiap varian
  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-purple-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: 
      "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;