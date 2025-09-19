'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const navItems = [
    { label:'Dashboard', href: '/' },
    { label: 'Pacientes', href: '/pacientes' },
    { label: 'Citas', href: '/citas' },
    { label: 'Notas', href: '/notas' },
    { label: 'Facturación', href: '/facturacion' },
]

const NavItems = () => {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-4">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(pathname === href && 'text-primary font-semibold')}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems
